import { Router, raw } from "express";
import rateLimit from "express-rate-limit";
import { createCheckout, handleWebhook } from "../controllers/payments.js";
import { logger } from "../lib/logger.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Rate limit for checkout to prevent abuse
const checkoutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // 2 checkout attempts per minute
  message: "Too many checkout requests. Please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many checkout requests. Please try again later",
    });
  },
});

// Create checkout session (requires authentication)
router.post("/create-checkout", requireAuth, checkoutLimiter, createCheckout);

// Webhook endpoint with raw body for signature verification
router.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  try {
    // Get the raw body
    const rawBody =
      req.body instanceof Buffer
        ? req.body.toString()
        : JSON.stringify(req.body);

    // Parse the JSON
    const parsedBody = JSON.parse(rawBody);

    // Call the webhook handler with raw body
    await handleWebhook(parsedBody, rawBody, req.headers, res);
  } catch (error) {
    logger.error({ error }, "Webhook error");
    res.status(400).json({ error: "Invalid webhook" });
  }
});

export default router;
