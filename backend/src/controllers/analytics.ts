import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { articlesTable, articleViewsTable, usersTable } from "../db/schema";
import { db } from "../lib/db";
import { logger } from "../lib/logger";
import { getCountryFromIP } from "../services/geoip";
import { parseUserAgent } from "../services/userAgent";

export async function trackArticleView(req: Request, res: Response) {
  try {
    let { articleId } = req.params;
    if (Array.isArray(articleId)) {
      articleId = articleId[0];
    }

    // Handle both JSON and form-urlencoded data from sendBeacon
    let sessionDuration = req.body.sessionDuration;
    if (typeof sessionDuration === "string") {
      sessionDuration = parseInt(sessionDuration);
    }

    // Get client IP address for geolocation only
    const ipAddress =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    // Get user agent
    const userAgent = req.headers["user-agent"] || "unknown";

    // Parse user agent for OS and browser
    const { os, browser } = parseUserAgent(userAgent);

    // Get country from IP (but don't save the IP itself)
    const country = getCountryFromIP(ipAddress);

    // Create article view record
    const insertResult = await db
      .insert(articleViewsTable)
      .values({
        id: crypto.randomUUID(),
        articleId,
        userAgent,
        country,
        os,
        browser,
        sessionDuration:
          sessionDuration && !isNaN(sessionDuration) ? sessionDuration : null,
      })
      .returning();

    const view = insertResult[0];

    logger.info(
      {
        viewId: view.id,
        articleId,
        country,
        os,
        browser,
        sessionDuration,
      },
      "Article view tracked successfully"
    );

    res.json({
      success: true,
      viewId: view.id,
    });
  } catch (error) {
    logger.error(
      { articleId: req.params.articleId, error },
      "Error tracking article view"
    );
    res.status(500).json({ error: "Failed to track view" });
  }
}

export async function getArticleAnalytics(req: Request, res: Response) {
  try {
    let { articleId } = req.params;
    if (Array.isArray(articleId)) {
      articleId = articleId[0];
    }

    // Get authenticated user ID - handle different possible structures
    let userId: string | undefined;

    if (typeof req.user === "string") {
      userId = req.user;
    } else if (req.user && typeof req.user === "object") {
      const userObj = req.user as any;
      userId =
        userObj.id || (Array.isArray(userObj.id) ? userObj.id[0] : undefined);
    }

    if (!userId) {
      logger.warn({ articleId }, "Analytics request without user ID");
      return res.status(401).json({ error: "Unauthorized: No user ID" });
    }

    // Get all views for this article
    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, articleId));

    const article = articles[0];

    if (!article) {
      logger.warn({ articleId }, "Analytics request for non-existent article");
      return res.status(404).json({ error: "Article not found" });
    }

    const views = await db
      .select()
      .from(articleViewsTable)
      .where(eq(articleViewsTable.articleId, articleId))
      .orderBy(desc(articleViewsTable.createdAt));

    // Check if user owns the article
    if (article.userId !== userId) {
      logger.warn(
        { userId, articleId, ownerId: article.userId },
        "Analytics request: unauthorized access attempt"
      );
      return res.status(403).json({ error: "Unauthorized: Not your article" });
    }

    // Get user and check if they have paid access
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    const user = users[0];

    if (!user || !user.isPaid) {
      logger.warn({ userId, articleId }, "Analytics request: user not paid");
      return res
        .status(403)
        .json({ error: "Analytics is only available for paid users" });
    }

    // Calculate analytics
    const totalViews = views.length;

    // Group views by country
    const viewsByCountry: { [key: string]: number } = {};
    const viewsByOS: { [key: string]: number } = {};
    const viewsByBrowser: { [key: string]: number } = {};
    let totalSessionDuration = 0;
    let sessionCount = 0;

    views.forEach((view) => {
      // Count countries, with "Unknown" for null (localhost development)
      const country = view.country || "Unknown";
      viewsByCountry[country] = (viewsByCountry[country] || 0) + 1;

      // Count OS, with "Unknown" for null
      const os = view.os || "Unknown";
      viewsByOS[os] = (viewsByOS[os] || 0) + 1;

      // Count browser, with "Unknown" for null
      const browser = view.browser || "Unknown";
      viewsByBrowser[browser] = (viewsByBrowser[browser] || 0) + 1;

      if (view.sessionDuration) {
        totalSessionDuration += view.sessionDuration;
        sessionCount += 1;
      }
    });

    // Views over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const viewsOverTime: { [key: string]: number } = {};
    views
      .filter((v) => v.createdAt >= thirtyDaysAgo)
      .forEach((view) => {
        const date = view.createdAt.toISOString().split("T")[0];
        viewsOverTime[date] = (viewsOverTime[date] || 0) + 1;
      });

    const avgSessionDuration =
      sessionCount > 0 ? Math.round(totalSessionDuration / sessionCount) : 0;

    logger.info(
      { userId, articleId, totalViews, avgSessionDuration, sessionCount },
      "Article analytics retrieved successfully"
    );

    res.json({
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
      },
      stats: {
        totalViews,
        avgSessionDuration,
        viewsByCountry: Object.entries(viewsByCountry)
          .map(([country, count]) => ({
            country,
            count,
          }))
          .sort((a, b) => b.count - a.count),
        viewsByOS: Object.entries(viewsByOS)
          .map(([os, count]) => ({
            os,
            count,
          }))
          .sort((a, b) => b.count - a.count),
        viewsByBrowser: Object.entries(viewsByBrowser)
          .map(([browser, count]) => ({
            browser,
            count,
          }))
          .sort((a, b) => b.count - a.count),
        viewsOverTime,
      },
    });
  } catch (error) {
    logger.error(
      { userId: (req.user as any)?.id, articleId: req.params.articleId, error },
      "Error getting article analytics"
    );
    res.status(500).json({ error: "Failed to get analytics" });
  }
}
