import { randomBytes, randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { Response } from "express";
import { z } from "zod";
import { magicLinksTable, usersTable } from "../db/schema.js";
import { db } from "../lib/db.js";
import { sendMagicLinkEmail } from "../lib/email.js";
import { logger } from "../lib/logger.js";
import { AuthRequest } from "../types/auth.js";
import { AuthPayload } from "../types/user.js";

export const logout = (req: AuthRequest, res: Response) => {
  try {
    req.logout((err) => {
      if (err) {
        logger.error({ error: err }, "Logout error");
        return res.status(500).json({ error: "Logout failed" });
      }

      // Destroy the session
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          logger.error({ error: sessionErr }, "Session destruction error");
          return res.status(500).json({ error: "Logout failed" });
        }

        // Clear the session cookie
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
      });
    });
  } catch (error) {
    logger.error({ error }, "Logout error");
    res.status(500).json({ error: "Logout failed" });
  }
};

export const getSession = (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = req.user as AuthPayload;

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isPaid: user.isPaid,
      },
    });
  } catch (error) {
    logger.error({ error }, "Get session error");
    res.status(500).json({ error: "Failed to get session" });
  }
};

const sendMagicLinkSchema = z.object({
  email: z.email(),
});

export const sendMagicLink = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = sendMagicLinkSchema.parse(req.body);

    logger.info({ email }, "Magic link request");

    // Generate token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store magic link
    await db.insert(magicLinksTable).values({
      id: randomUUID(),
      email,
      token,
      expiresAt,
    });

    // Send email with magic link
    const magicLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/auth/magic-link?token=${token}`;

    try {
      await sendMagicLinkEmail(email, magicLink);
      logger.info({ email }, "Magic link email sent successfully");
    } catch (emailError) {
      logger.error({ emailError, email }, "Failed to send magic link email");
      // Don't fail the request if email fails in development
      if (process.env.NODE_ENV === "production") {
        throw emailError;
      }
    }

    // For development, return the token (remove in production)
    res.json({
      message: "Magic link sent to your email",
      ...(process.env.NODE_ENV === "development" && { token, magicLink }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(
        { error: error.issues },
        "Validation error in magic link request",
      );
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error({ error }, "Magic link error");
    res.status(500).json({ error: "Failed to send magic link" });
  }
};

export const verifyMagicLink = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = z.object({ token: z.string() }).parse(req.body);

    logger.info(
      { token: token.substring(0, 10) + "..." },
      "Magic link verification",
    );

    // Find the magic link
    const links = await db
      .select()
      .from(magicLinksTable)
      .where(eq(magicLinksTable.token, token));

    const link = links[0];

    if (!link) {
      logger.warn(
        { token: token.substring(0, 10) + "..." },
        "Magic link not found",
      );
      return res.status(401).json({ error: "Invalid magic link" });
    }

    if (link.used) {
      logger.warn({ email: link.email }, "Magic link already used");
      return res.status(401).json({ error: "Magic link already used" });
    }

    if (new Date() > link.expiresAt) {
      logger.warn({ email: link.email }, "Magic link expired");
      return res.status(401).json({ error: "Magic link expired" });
    }

    // Mark as used
    await db
      .update(magicLinksTable)
      .set({ used: true })
      .where(eq(magicLinksTable.id, link.id));

    // Find or create user
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, link.email));

    let user = users[0];

    if (!user) {
      // Create new user with magic link
      const username =
        link.email.split("@")[0] +
        randomBytes(4).toString("hex").substring(0, 6);

      const insertResult = await db
        .insert(usersTable)
        .values({
          id: randomUUID(),
          username,
          email: link.email,
          isPaid: false,
        })
        .returning();

      user = insertResult[0];
      logger.info(
        { userId: user.id, email: user.email },
        "New user created via magic link",
      );
    }

    // Create session
    const authPayload: AuthPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      isPaid: user.isPaid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    req.login(authPayload, (err) => {
      if (err) {
        logger.error({ error: err }, "Session creation error after magic link");
        return res.status(500).json({ error: "Session creation failed" });
      }

      logger.info(
        { userId: user.id, email: user.email },
        "User logged in via magic link",
      );

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isPaid: user.isPaid,
        },
        message: "Logged in successfully",
      });
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(
        { error: error.issues },
        "Validation error in magic link verification",
      );
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error({ error }, "Magic link verification error");
    res.status(500).json({ error: "Failed to verify magic link" });
  }
};
