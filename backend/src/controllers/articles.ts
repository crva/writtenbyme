import { and, desc, eq, not } from "drizzle-orm";
import { Response } from "express";
import { z } from "zod";
import { articlesTable, usersTable } from "../db/schema";
import { db } from "../lib/db";
import { logger } from "../lib/logger";
import { generateSlug } from "../lib/slug";
import { AuthRequest } from "../types/auth";

const articleSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string(),
});

/**
 * Generate a unique slug for an article by appending a number if the slug already exists
 */
async function generateUniqueSlug(
  userId: string,
  title: string,
  excludeId?: string
): Promise<string> {
  let slug = generateSlug(title);
  let count = 1;
  const maxAttempts = 100;

  while (count < maxAttempts) {
    const existing = await db
      .select()
      .from(articlesTable)
      .where(
        and(
          eq(articlesTable.userId, userId),
          eq(articlesTable.slug, slug),
          excludeId ? not(eq(articlesTable.id, excludeId)) : undefined
        )
      );

    if (existing.length === 0) {
      return slug;
    }

    // Append number to slug
    slug = `${generateSlug(title)}-${count}`;
    count++;
  }

  // Fallback: use timestamp
  return `${generateSlug(title)}-${Date.now()}`;
}

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const data = articleSchema.parse(req.body);

    // Check if title already exists for this user
    const existingArticles = await db
      .select()
      .from(articlesTable)
      .where(
        and(
          eq(articlesTable.userId, req.user.id),
          eq(articlesTable.title, data.title)
        )
      );

    if (existingArticles.length > 0) {
      logger.warn(
        { userId: req.user.id, title: data.title },
        "Article creation failed: title already exists"
      );
      return res
        .status(409)
        .json({ error: "An article with this title already exists" });
    }

    const slug = await generateUniqueSlug(req.user.id, data.title);

    const insertResult = await db
      .insert(articlesTable)
      .values({
        id: crypto.randomUUID(),
        userId: req.user.id,
        title: data.title,
        slug: slug,
        content: data.content,
      })
      .returning();

    const article = insertResult[0];

    logger.info(
      {
        userId: req.user.id,
        articleId: article.id,
        title: article.title,
        slug: article.slug,
      },
      "Article created"
    );

    res.status(201).json({
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(
        { userId: req.user?.id, validationError: error.issues[0].message },
        "Article creation validation failed"
      );
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error({ userId: req.user?.id, error }, "Article creation error");
    res.status(500).json({ error: "Failed to create article" });
  }
};

export const updateArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;
    const data = articleSchema.parse(req.body);

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id));

    const article = articles[0];

    if (!article) {
      logger.warn(
        { userId: req.user.id, articleId: id },
        "Article update failed: article not found"
      );
      return res.status(404).json({ error: "Article not found" });
    }

    if (article.userId !== req.user.id) {
      logger.warn(
        { userId: req.user.id, articleId: id, ownerId: article.userId },
        "Article update failed: unauthorized access"
      );
      return res.status(403).json({ error: "Unauthorized" });
    }

    const slug = await generateUniqueSlug(req.user.id, data.title, id);

    const updateResult = await db
      .update(articlesTable)
      .set({
        title: data.title,
        slug: slug,
        content: data.content,
        updatedAt: new Date(),
      })
      .where(eq(articlesTable.id, id))
      .returning();

    const updated = updateResult[0];

    logger.info(
      {
        userId: req.user.id,
        articleId: id,
        title: updated.title,
        slug: updated.slug,
      },
      "Article updated"
    );

    res.json({
      article: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        content: updated.content,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(
        {
          userId: req.user?.id,
          articleId: req.params.id,
          validationError: error.issues[0].message,
        },
        "Article update validation failed"
      );
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error(
      { userId: req.user?.id, articleId: req.params.id, error },
      "Article update error"
    );
    res.status(500).json({ error: "Failed to update article" });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.id, id));

    const article = articles[0];

    if (!article) {
      logger.warn(
        { userId: req.user.id, articleId: id },
        "Article deletion failed: article not found"
      );
      return res.status(404).json({ error: "Article not found" });
    }

    if (article.userId !== req.user.id) {
      logger.warn(
        { userId: req.user.id, articleId: id, ownerId: article.userId },
        "Article deletion failed: unauthorized access"
      );
      return res.status(403).json({ error: "Unauthorized" });
    }

    await db.delete(articlesTable).where(eq(articlesTable.id, id));

    logger.info(
      { userId: req.user.id, articleId: id, title: article.title },
      "Article deleted"
    );

    res.json({ message: "Article deleted" });
  } catch (error) {
    logger.error(
      { userId: req.user?.id, articleId: req.params.id, error },
      "Article deletion error"
    );
    res.status(500).json({ error: "Failed to delete article" });
  }
};

export const getUserArticles = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    const user = users[0];

    if (!user) {
      logger.debug({ username }, "User articles fetch: user not found");
      return res.status(404).json({ error: "User not found" });
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.userId, user.id))
      .orderBy(desc(articlesTable.createdAt));

    res.json({
      username: user.username,
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title,
        updatedAt: article.updatedAt.toISOString(),
        slug: article.slug,
      })),
    });
  } catch (error) {
    logger.error(
      { username: req.params.username, error },
      "Failed to fetch user articles"
    );
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export const getArticleBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { username, articleSlug } = req.params;

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    const user = users[0];

    if (!user) {
      logger.debug({ username }, "Article fetch: user not found");
      return res.status(404).json({ error: "User not found" });
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(
        and(
          eq(articlesTable.userId, user.id),
          eq(articlesTable.slug, articleSlug.toLowerCase())
        )
      );

    const article = articles[0];

    if (!article) {
      logger.debug(
        { username, articleSlug },
        "Article fetch: article not found"
      );
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        author: user.username,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    logger.error(
      {
        username: req.params.username,
        articleSlug: req.params.articleSlug,
        error,
      },
      "Failed to fetch article by slug"
    );
    res.status(500).json({ error: "Failed to fetch article" });
  }
};

export const getMyArticles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const articles = await db
      .select()
      .from(articlesTable)
      .where(eq(articlesTable.userId, req.user.id))
      .orderBy(desc(articlesTable.createdAt));

    logger.debug(
      { userId: req.user.id, articleCount: articles.length },
      "User articles retrieved"
    );

    res.json({
      articles: articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        updatedAt: article.updatedAt.toISOString(),
        createdAt: article.createdAt.toISOString(),
        content: article.content,
      })),
    });
  } catch (error) {
    logger.error(
      { userId: req.user?.id, error },
      "Failed to fetch user articles"
    );
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};
