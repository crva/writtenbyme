import { NextFunction, Response } from "express";
import { logger } from "../lib/logger.js";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../types/auth.js";

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.headers.cookie || "";

    const sessionCookie = cookies
      .split(";")
      .find((c) => c.trim().startsWith("authjs.session-token="));

    if (!sessionCookie) {
      logger.debug("Authentication failed: no session cookie found");
      return res.status(401).json({ error: "Unauthorized - no session" });
    }

    const token = sessionCookie.split("=")[1]?.trim();

    if (!token) {
      logger.debug("Authentication failed: invalid token format");
      return res.status(401).json({ error: "Unauthorized - invalid token" });
    }

    const session = await prisma.session.findFirst({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session) {
      logger.warn("Authentication failed: session not found in database");
      return res
        .status(401)
        .json({ error: "Unauthorized - session not found" });
    }

    if (new Date(session.expires) < new Date()) {
      logger.info(
        { userId: session.user.id, email: session.user.email },
        "Session expired"
      );
      return res.status(401).json({ error: "Unauthorized - session expired" });
    }

    req.user = {
      userId: session.user.id,
      username: session.user.username,
      email: session.user.email,
    };

    // logger.debug(
    //   { userId: session.user.id, email: session.user.email },
    //   "User authenticated"
    // );
    next();
  } catch (error) {
    logger.error({ error }, "Authentication error");
    res.status(401).json({ error: "Unauthorized" });
  }
};
