import logger from "@/lib/logger";
import { Router, raw } from "express";
import { createCheckout, handleWebhook } from "../controllers/payments";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Create checkout session (requires authentication)
router.post("/create-checkout", requireAuth, createCheckout);

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
