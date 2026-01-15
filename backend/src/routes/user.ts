import { Router } from "express";
import { deleteAccount, updateUsername } from "../controllers/user";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Protected routes - require authentication
router.post("/update-username", requireAuth, updateUsername);
router.post("/delete-account", requireAuth, deleteAccount);

export default router;
