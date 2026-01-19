import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getArticleAnalytics,
  trackArticleView,
} from "../controllers/analytics.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Rate limit for analytics endpoint
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || "",
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later",
    });
  },
});

// Track article view (public - anyone can track)
router.post("/:articleId/track", trackArticleView);

// Get analytics for an article (requires auth and ownership)
router.get(
  "/:articleId/analytics",
  requireAuth,
  analyticsLimiter,
  getArticleAnalytics,
);

export default router;
