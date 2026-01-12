import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { Router } from "express";
import { z } from "zod";
import { logger } from "../lib/logger.js";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../types/auth.js";

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const router = Router();

router.post("/register", async (req: AuthRequest, res) => {
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

    return res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      message: "User created. Please sign in.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({ error: error.issues }, "Validation error in registration");
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error({ error }, "Registration error");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/signin", async (req: AuthRequest, res) => {
  try {
    const data = loginSchema.parse(req.body);
    logger.info({ email: data.email }, "Login attempt");

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      logger.warn({ email: data.email }, "Login failed: User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      logger.warn({ userId: user.id }, "Login failed: Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = randomBytes(32).toString("hex");

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

    logger.info(
      { userId: user.id, username: user.username },
      "User signed in successfully"
    );

    res.setHeader(
      "Set-Cookie",
      `authjs.session-token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires.toUTCString()}`
    );

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({ error: error.issues }, "Validation error in signin");
      return res.status(400).json({ error: error.issues[0].message });
    }
    logger.error({ error }, "Sign in error");
    res.status(500).json({ error: "Sign in failed" });
  }
});

router.get("/session", async (req: AuthRequest, res) => {
  try {
    const sessionToken = req.cookies["authjs.session-token"];

    if (!sessionToken) {
      return res.status(401).json({ error: "No session token found" });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session) {
      return res.status(401).json({ error: "Session not found" });
    }

    if (new Date(session.expires) < new Date()) {
      // Delete expired session
      await prisma.session.delete({ where: { sessionToken } });
      logger.info({ userId: session.user.id }, "Session expired and deleted");
      return res.status(401).json({ error: "Session expired" });
    }

    return res.json({
      user: {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
      },
    });
  } catch (error) {
    logger.error({ error }, "Session validation error");
    res.status(500).json({ error: "Session validation failed" });
  }
});

router.post("/signout", async (req: AuthRequest, res) => {
  try {
    const sessionToken = req.cookies["authjs.session-token"];

    if (sessionToken) {
      // Delete the session from database
      await prisma.session.delete({
        where: { sessionToken },
      });
      logger.info("User signed out successfully");
    }

    // Clear the session cookie
    res.clearCookie("authjs.session-token");
    return res.json({ success: true });
  } catch (error) {
    logger.error({ error }, "Signout error");
    res.status(500).json({ error: "Signout failed" });
  }
});

export default router;
