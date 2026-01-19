import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import { articlesTable, articleViewsTable, usersTable } from "../db/schema.js";
import { db } from "../lib/db.js";
import { logger } from "../lib/logger.js";
import { getCountryFromIP } from "../services/geoip.js";
import { parseUserAgent } from "../services/userAgent.js";

export async function trackArticleView(req: Request, res: Response) {
  try {
    let { articleId } = req.params;
    if (Array.isArray(articleId)) {
      articleId = articleId[0];
    }

    // Handle both JSON and form-urlencoded data from sendBeacon
    let sessionDuration = req.body.sessionDuration;
    let maxScrollPercentage = req.body.maxScrollPercentage;

    if (typeof sessionDuration === "string") {
      sessionDuration = parseInt(sessionDuration);
    }
    if (typeof maxScrollPercentage === "string") {
      maxScrollPercentage = parseInt(maxScrollPercentage);
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
        maxScrollPercentage:
          maxScrollPercentage && !isNaN(maxScrollPercentage)
            ? maxScrollPercentage
            : 0,
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
        maxScrollPercentage,
      },
      "Article view tracked successfully",
    );

    res.json({
      success: true,
      viewId: view.id,
    });
  } catch (error) {
    logger.error(
      { articleId: req.params.articleId, error },
      "Error tracking article view",
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

    // Get time range from query params
    let timeRange = (req.query.timeRange as string) || "7d";
    if (!["24h", "7d", "30d", "all"].includes(timeRange)) {
      timeRange = "7d";
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

    // Check if user owns the article
    if (article.userId !== userId) {
      logger.warn(
        { userId, articleId, ownerId: article.userId },
        "Analytics request: unauthorized access attempt",
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

    // Calculate date range based on timeRange parameter
    const now = new Date();
    let startDate = new Date();

    if (timeRange === "24h") {
      startDate.setDate(startDate.getDate() - 1);
    } else if (timeRange === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === "30d") {
      startDate.setDate(startDate.getDate() - 30);
    }
    // "all" means no date filter

    // Get all views for this article, filtered by date range
    const allViews = await db
      .select()
      .from(articleViewsTable)
      .where(eq(articleViewsTable.articleId, articleId))
      .orderBy(desc(articleViewsTable.createdAt));

    const views =
      timeRange === "all"
        ? allViews
        : allViews.filter((v) => v.createdAt >= startDate);

    // Calculate analytics
    const totalViews = views.length;

    // Group views by country
    const viewsByCountry: { [key: string]: number } = {};
    const viewsByOS: { [key: string]: number } = {};
    const viewsByBrowser: { [key: string]: number } = {};
    let totalSessionDuration = 0;
    let sessionCount = 0;
    let totalScrollPercentage = 0;
    let scrollCount = 0;

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

      if (view.maxScrollPercentage) {
        totalScrollPercentage += view.maxScrollPercentage;
        scrollCount += 1;
      }
    });

    const avgSessionDuration =
      sessionCount > 0 ? Math.round(totalSessionDuration / sessionCount) : 0;

    const avgScrollPercentage =
      scrollCount > 0 ? Math.round(totalScrollPercentage / scrollCount) : 0;

    // Calculate views per day
    const viewsByDay: { [date: string]: number } = {};
    views.forEach((view) => {
      const date = view.createdAt.toISOString().split("T")[0];
      viewsByDay[date] = (viewsByDay[date] || 0) + 1;
    });

    // Convert to sorted array
    const dailyViews = Object.entries(viewsByDay)
      .map(([date, count]) => ({
        day: new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "2-digit",
          day: "2-digit",
        }),
        views: count,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.day);
        const dateB = new Date(b.day);
        return dateA.getTime() - dateB.getTime();
      });

    // Calculate completion rate (percentage of users who scrolled to 100%)
    const completionRate =
      totalViews > 0
        ? Math.round(
            (views.filter((v) => v.maxScrollPercentage >= 100).length /
              totalViews) *
              100,
          )
        : 0;

    // Calculate reading time distribution based on actual min/max times
    const sessionDurations = views
      .filter((v) => v.sessionDuration && v.sessionDuration > 0)
      .map((v) => v.sessionDuration as number)
      .sort((a, b) => a - b);

    const readingTimeDistribution = calculateReadingTimeDistribution(
      sessionDurations,
      views,
    );

    logger.info(
      {
        userId,
        articleId,
        totalViews,
        avgSessionDuration,
        sessionCount,
        timeRange,
      },
      "Article analytics retrieved successfully",
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
        avgScrollPercentage,
        completionRate,
        readingTimeDistribution,
        dailyViews,
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
      },
    });
  } catch (error) {
    logger.error(
      { userId: (req.user as any)?.id, articleId: req.params.articleId, error },
      "Error getting article analytics",
    );
    res.status(500).json({ error: "Failed to get analytics" });
  }
}

// Helper function to calculate reading time distribution based on actual data
function calculateReadingTimeDistribution(
  sessionDurations: number[],
  allViews: any[],
) {
  if (sessionDurations.length === 0) {
    return [{ range: "No data", count: 0, percentage: 0 }];
  }

  const min = Math.min(...sessionDurations);
  const max = Math.max(...sessionDurations);

  // Create 5 buckets with even distribution
  const bucketSize = (max - min) / 5 || 1;

  const buckets = [
    {
      range: `0-${Math.ceil(min + bucketSize)}s`,
      min: 0,
      max: min + bucketSize,
      count: 0,
    },
    {
      range: `${Math.ceil(min + bucketSize + 1)}-${Math.ceil(min + bucketSize * 2)}s`,
      min: min + bucketSize,
      max: min + bucketSize * 2,
      count: 0,
    },
    {
      range: `${Math.ceil(min + bucketSize * 2 + 1)}-${Math.ceil(min + bucketSize * 3)}s`,
      min: min + bucketSize * 2,
      max: min + bucketSize * 3,
      count: 0,
    },
    {
      range: `${Math.ceil(min + bucketSize * 3 + 1)}-${Math.ceil(min + bucketSize * 4)}s`,
      min: min + bucketSize * 3,
      max: min + bucketSize * 4,
      count: 0,
    },
    {
      range: `${Math.ceil(min + bucketSize * 4 + 1)}s+`,
      min: min + bucketSize * 4,
      max: Infinity,
      count: 0,
    },
  ];

  // Distribute views into buckets
  sessionDurations.forEach((duration) => {
    for (let i = 0; i < buckets.length; i++) {
      if (duration >= buckets[i].min && duration < buckets[i].max) {
        buckets[i].count++;
        break;
      }
      if (i === buckets.length - 1) {
        buckets[i].count++;
        break;
      }
    }
  });

  // Calculate percentages
  return buckets.map((bucket) => ({
    range: bucket.range,
    count: bucket.count,
    percentage: Math.round((bucket.count / sessionDurations.length) * 100),
  }));
}
