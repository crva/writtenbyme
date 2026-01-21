import { and, eq, not } from "drizzle-orm";
import { Response } from "express";
import { z } from "zod";
import {
  articlesTable,
  articleViewsTable,
  magicLinksTable,
  usersTable,
} from "../db/schema.js";
import { db } from "../lib/db.js";
import { logger } from "../lib/logger.js";
import { polar } from "../lib/polar.js";
import { AuthRequest } from "../types/auth.js";

const updateUsernameSchema = z.object({
  username: z.string().min(3).max(30),
});

export const updateUsername = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = updateUsernameSchema.parse(req.body);

    logger.info(
      { userId: req.user.id, newUsername: data.username },
      "Username update attempt",
    );

    // Check if new username already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.username, data.username),
          // Exclude the current user from the check
          //eq(usersTable.id, req.user.id) is the NOT check below
        ),
      );

    if (existingUser.length > 0 && existingUser[0].id !== req.user.id) {
      logger.warn(
        { username: data.username },
        "Username update failed: Username already taken",
      );
      return res.status(400).json({ error: "Username already taken" });
    }

    // Update the username
    const updatedUsers = await db
      .update(usersTable)
      .set({ username: data.username })
      .where(eq(usersTable.id, req.user.id))
      .returning();

    if (updatedUsers.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = updatedUsers[0];

    logger.info({ userId: req.user.id }, "Username updated successfully");

    return res.json({
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        isPaid: updatedUser.isPaid,
      },
      message: "Username updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(
        { error: error.issues },
        "Validation error in username update",
      );
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error({ error }, "Username update error");
    res.status(500).json({ error: "Failed to update username" });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    logger.info({ userId }, "Account deletion attempt");

    // Fetch user to get subscription ID if it exists
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Cancel Polar subscription if the user has one
    if (user[0].polarSubscriptionId) {
      try {
        await polar.subscriptions.revoke({
          id: user[0].polarSubscriptionId,
        });
        logger.info(
          { userId, subscriptionId: user[0].polarSubscriptionId },
          "Polar subscription revoked during account deletion",
        );
      } catch (error) {
        logger.error(
          { error, userId, subscriptionId: user[0].polarSubscriptionId },
          "Failed to revoke Polar subscription during account deletion",
        );
        return res.status(500).json({
          error:
            "Unable to revoke subscription. Please contact support@writtenbyme.online",
        });
      }
    }

    // Start a transaction to ensure all data is deleted
    // Drizzle doesn't have built-in transaction support for all databases,
    // so we'll delete in the correct order to avoid foreign key issues

    // 1. Delete all article views for this user's articles
    const userArticles = await db
      .select({ id: articlesTable.id })
      .from(articlesTable)
      .where(eq(articlesTable.userId, userId));

    for (const article of userArticles) {
      await db
        .delete(articleViewsTable)
        .where(eq(articleViewsTable.articleId, article.id));
    }

    // 2. Delete all articles for this user
    await db.delete(articlesTable).where(eq(articlesTable.userId, userId));

    // 3. Delete all magic links for this user
    await db
      .delete(magicLinksTable)
      .where(eq(magicLinksTable.email, req.user.email));

    // 4. Delete the user
    await db.delete(usersTable).where(eq(usersTable.id, userId));

    logger.info({ userId }, "Account deleted successfully");

    // Destroy the session
    req.logout((err) => {
      if (err) {
        logger.error(
          { error: err },
          "Error logging out during account deletion",
        );
      }
    });

    return res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    logger.error({ error }, "Account deletion error");
    res.status(500).json({ error: "Failed to delete account" });
  }
};

export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    logger.info({ userId }, "Subscription cancellation attempt");

    // Fetch user to get subscription ID
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user[0].isPaid) {
      return res.status(400).json({ error: "User does not have an active subscription" });
    }

    // Cancel Polar subscription
    if (user[0].polarSubscriptionId) {
      try {
        await polar.subscriptions.revoke({
          id: user[0].polarSubscriptionId,
        });
        logger.info(
          { userId, subscriptionId: user[0].polarSubscriptionId },
          "Polar subscription revoked",
        );
      } catch (error) {
        logger.error(
          { error, userId, subscriptionId: user[0].polarSubscriptionId },
          "Failed to revoke Polar subscription",
        );
        return res.status(500).json({
          error:
            "Unable to cancel subscription. Please contact support@writtenbyme.online",
        });
      }
    }

    // Get user's first article (by createdAt) to exclude it from locking
    const firstArticle = await db
      .select({ id: articlesTable.id })
      .from(articlesTable)
      .where(eq(articlesTable.userId, userId))
      .orderBy(articlesTable.createdAt)
      .limit(1);

    const firstArticleId = firstArticle.length > 0 ? firstArticle[0].id : null;

    // Lock all articles except the first one using NOT condition
    if (firstArticleId) {
      // Get all articles to lock (all except first)
      const articlesToLock = await db
        .select({ id: articlesTable.id })
        .from(articlesTable)
        .where(
          and(
            eq(articlesTable.userId, userId),
            not(eq(articlesTable.id, firstArticleId))
          ),
        );

      // Update each article to locked
      for (const article of articlesToLock) {
        await db
          .update(articlesTable)
          .set({ status: "locked" })
          .where(eq(articlesTable.id, article.id));
      }

      logger.info(
        { userId, firstArticleId, lockedCount: articlesToLock.length },
        "Articles locked except first",
      );
    }

    // Update user: set isPaid to false and clear subscription ID
    const updatedUsers = await db
      .update(usersTable)
      .set({ isPaid: false, polarSubscriptionId: null })
      .where(eq(usersTable.id, userId))
      .returning();

    const updatedUser = updatedUsers[0];

    logger.info(
      { userId, subscriptionId: user[0].polarSubscriptionId },
      "Subscription cancelled - articles locked",
    );

    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        isPaid: updatedUser.isPaid,
      },
      message: "Subscription cancelled successfully. Your articles (except the first one) have been locked.",
    });
  } catch (error) {
    logger.error({ error, userId: req.user?.id }, "Subscription cancellation error");
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
};
