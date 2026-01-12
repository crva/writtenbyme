import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../types/auth.js";

const articleSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export const createArticle = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const data = articleSchema.parse(req.body);

    const article = await prisma.article.create({
      data: {
        userId: req.user.userId,
        title: data.title,
        content: data.content,
      },
    });

    res.status(201).json({
      id: article.id,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
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

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
      },
    });

    res.json({
      id: updated.id,
      title: updated.title,
      content: updated.content,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
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
        title: {
          mode: "insensitive",
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({
      id: article.id,
      title: article.title,
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
        content: article.content,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};
