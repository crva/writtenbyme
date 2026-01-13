import { Router } from "express";
import passport from "passport";
import { getSession, login, logout, register } from "../controllers/auth.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);

router.post(
  "/signin",
  passport.authenticate("local", { session: true }),
  login
);

router.post("/signout", logout);

router.get("/session", requireAuth, getSession);

export default router;
