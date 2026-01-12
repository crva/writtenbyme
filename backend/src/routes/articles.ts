import { Router } from "express";
import * as articlesController from "../controllers/articles.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/", verifyToken, articlesController.createArticle);
router.get("/me", verifyToken, articlesController.getMyArticles);
router.put("/:id", verifyToken, articlesController.updateArticle);
router.delete("/:id", verifyToken, articlesController.deleteArticle);

router.get("/:username", articlesController.getUserArticles);
router.get("/:username/:articleSlug", articlesController.getArticleBySlug);

export default router;
