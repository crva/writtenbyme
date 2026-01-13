import { Router } from "express";
import * as articlesController from "../controllers/articles";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, articlesController.createArticle);
router.get("/me", requireAuth, articlesController.getMyArticles);
router.put("/:id", requireAuth, articlesController.updateArticle);
router.delete("/:id", requireAuth, articlesController.deleteArticle);

// More specific routes must come before less specific ones
router.get("/:username/:articleSlug", articlesController.getArticleBySlug);
router.get("/:username", articlesController.getUserArticles);

export default router;
