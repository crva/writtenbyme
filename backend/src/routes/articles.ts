import { Router } from "express";
import * as articlesController from "../controllers/articles.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, articlesController.createArticle);
router.get("/me", verifyToken, articlesController.getMyArticles);
router.put("/:id", verifyToken, articlesController.updateArticle);
router.delete("/:id", verifyToken, articlesController.deleteArticle);

// More specific routes must come before less specific ones
router.get("/:username/:articleSlug", articlesController.getArticleBySlug);
router.get("/:username", articlesController.getUserArticles);

export default router;
