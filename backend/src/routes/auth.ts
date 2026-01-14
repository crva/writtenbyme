import { Request, Response, Router } from "express";
import passport from "passport";
import { getSession, login, logout, register } from "../controllers/auth";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", register);

router.post("/signin", (req: Request, res: Response, next) => {
  passport.authenticate(
    "local",
    { session: true },
    (err: Error | null, user: any, info: { message?: string }) => {
      if (err) {
        return res.status(500).json({ error: "Authentication failed" });
      }
      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: "Session creation failed" });
        }
        return login(req as any, res);
      });
    }
  )(req, res, next);
});

router.post("/signout", logout);

router.get("/session", requireAuth, getSession);

export default router;
