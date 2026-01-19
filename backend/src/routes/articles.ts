import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import * as articlesController from "../controllers/articles.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Rate limit for article mutations (create, update, delete)
const articleMutationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: "Too many article operations. Please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    ipKeyGenerator(req.ip || req.socket.remoteAddress || ""),
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many article operations. Please try again later",
    });
  },
});

router.post(
  "/",
  requireAuth,
  articleMutationLimiter,
  articlesController.createArticle,
);
router.get("/me", requireAuth, articlesController.getMyArticles);
router.put(
  "/:id",
  requireAuth,
  articleMutationLimiter,
  articlesController.updateArticle,
);
router.delete(
  "/:id",
  requireAuth,
  articleMutationLimiter,
  articlesController.deleteArticle,
);

// More specific routes must come before less specific ones
router.get("/:username/:articleSlug", articlesController.getArticleBySlug);
router.get("/:username", articlesController.getUserArticles);

export default router;
