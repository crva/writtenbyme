import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { generateSlug } from "../lib/slug.js";
import { AuthRequest } from "../types/auth.js";

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
    const existing = await prisma.article.findFirst({
      where: {
        userId,
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });

    if (!existing) {
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
    const existingArticle = await prisma.article.findFirst({
      where: {
        userId: req.user.userId,
        title: data.title,
      },
    });

    if (existingArticle) {
      return res
        .status(409)
        .json({ error: "An article with this title already exists" });
    }

    const slug = await generateUniqueSlug(req.user.userId, data.title);

    const article = await prisma.article.create({
      data: {
        userId: req.user.userId,
        title: data.title,
        slug: slug,
        content: data.content,
      },
    });

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
      return res.status(400).json({ error: error.issues[0].message });
    }
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

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (article.userId !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const slug = await generateUniqueSlug(req.user.userId, data.title, id);

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
      },
    });

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
      return res.status(400).json({ error: error.issues[0].message });
    }
    res.status(500).json({ error: "Failed to update article" });
  }
};

export const deleteArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (article.userId !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.article.delete({
      where: { id },
    });

    res.json({ message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete article" });
  }
};

export const getUserArticles = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        articles: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      articles: user.articles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export const getArticleBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { username, articleSlug } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const article = await prisma.article.findFirst({
      where: {
        userId: user.id,
        slug: articleSlug.toLowerCase(),
      },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch article" });
  }
};

export const getMyArticles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const articles = await prisma.article.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(
      articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};
