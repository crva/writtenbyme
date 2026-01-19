import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import {
  getSession,
  logout,
  sendMagicLink,
  verifyMagicLink,
} from "../controllers/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const magicLinkLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1, // 1 requests per minute per IP
  message: "Too many requests. Please try again in a minute",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    ipKeyGenerator(req.ip || req.socket.remoteAddress || ""),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. Please try again in a minute",
    });
  },
  // Rate limit by IP only to prevent mass email spam from same source
});

const verifyMagicLinkLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 attempts per minute to prevent brute force
  message: "Too many verification attempts. Please try again in a minute",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    ipKeyGenerator(req.ip || req.socket.remoteAddress || ""),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many verification attempts. Please try again in a minute",
    });
  },
});

router.post("/magic-link/send", magicLinkLimiter, sendMagicLink);

router.post("/magic-link/verify", verifyMagicLinkLimiter, verifyMagicLink);

router.post("/signout", logout);

router.get("/session", requireAuth, getSession);

export default router;
