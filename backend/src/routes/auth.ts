import { Router } from "express";
import {
  getSession,
  logout,
  sendMagicLink,
  verifyMagicLink,
} from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/magic-link/send", sendMagicLink);

router.post("/magic-link/verify", verifyMagicLink);

router.post("/signout", logout);

router.get("/session", requireAuth, getSession);

export default router;
