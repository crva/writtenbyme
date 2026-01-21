import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { cancelSubscription, deleteAccount, updateUsername } from "../controllers/user.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Rate limit for username updates
const updateUsernameLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1, // 1 request per 5 minutes
  message: "Username can only be changed once every 5 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    ipKeyGenerator(req.ip || req.socket.remoteAddress || ""),
  handler: (req, res) => {
    res.status(429).json({
      error: "Username can only be changed once every 5 minutes",
    });
  },
});

// Protected routes - require authentication
router.post(
  "/update-username",
  requireAuth,
  updateUsernameLimiter,
  updateUsername,
);
router.post("/delete-account", requireAuth, deleteAccount);
router.post("/cancel-subscription", requireAuth, cancelSubscription);

export default router;
