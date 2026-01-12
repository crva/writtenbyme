import { NextFunction, Response } from "express";
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
      console.log("No session cookie found. Cookies:", cookies);
      return res.status(401).json({ error: "Unauthorized - no session" });
    }

    const token = sessionCookie.split("=")[1]?.trim();

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - invalid token" });
    }

    const session = await prisma.session.findFirst({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session) {
      console.log("Session not found in DB for token:", token);
      return res
        .status(401)
        .json({ error: "Unauthorized - session not found" });
    }

    if (new Date(session.expires) < new Date()) {
      return res.status(401).json({ error: "Unauthorized - session expired" });
    }

    req.user = {
      userId: session.user.id,
      username: session.user.username,
      email: session.user.email,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
