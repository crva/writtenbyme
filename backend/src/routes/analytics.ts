import { getArticleAnalytics, trackArticleView } from "@/controllers/analytics";
import { requireAuth } from "@/middleware/auth";
import { Router } from "express";

const router = Router();

// Track article view (public - anyone can track)
router.post("/:articleId/track", trackArticleView);

// Get analytics for an article (requires auth and ownership)
router.get("/:articleId/analytics", requireAuth, getArticleAnalytics);

export default router;
