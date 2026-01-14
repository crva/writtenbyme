import bcrypt from "bcryptjs";
import { Response } from "express";
import { z } from "zod";
import { logger } from "../lib/logger";
import { prisma } from "../lib/prisma";
import { AuthPayload, AuthRequest } from "../types/auth";

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6),
});

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    logger.info(
      { email: data.email, username: data.username },
      "Registration attempt"
    );

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      logger.warn(
        { email: data.email },
        "Registration failed: User already exists"
      );
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    logger.info(
      { userId: user.id, username: user.username },
      "User registered successfully"
    );

    // Establish session after registration
    req.login(user as AuthPayload, (err) => {
      if (err) {
        logger.error(
          { error: err },
          "Session creation error after registration"
        );
        return res
          .status(500)
          .json({
            error: "Registration successful but session creation failed",
          });
      }

      return res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isPaid: user.isPaid,
        },
        message: "User registered successfully",
      });
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({ error: error.issues }, "Validation error in registration");
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error({ error }, "Registration error");
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = req.user as AuthPayload;

    logger.info(
      { userId: user.id, username: user.username },
      "User logged in successfully"
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
  } catch (error) {
    logger.error({ error }, "Login error");
    res.status(500).json({ error: "Login failed" });
  }
};

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
        logger.info("User logged out and session destroyed");
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
