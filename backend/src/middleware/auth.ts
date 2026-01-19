import { NextFunction, Response } from "express";
import { logger } from "../lib/logger.js";
import { AuthRequest } from "../types/auth.js";

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    logger.debug("Authentication failed: no authenticated user");
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
