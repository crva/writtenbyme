import { Polar } from "@polar-sh/sdk";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { Response } from "express";
import { config } from "../config/config.js";
import { usersTable } from "../db/schema.js";
import { db } from "../lib/db.js";
import { logger } from "../lib/logger.js";
import { AuthRequest } from "../types/auth.js";

// Initialize Polar SDK with environment-specific server URL
const polar = new Polar({
  accessToken: config.polar.accessToken,
  serverURL: config.isDev
    ? "https://sandbox-api.polar.sh"
    : "https://api.polar.sh",
});

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Create a checkout session for the Pro plan
    const checkout = await polar.checkouts.create({
      products: [process.env.POLAR_PRO_PRICE_ID || ""],
      successUrl: `${config.frontendUrl}/dashboard?payment=success`,
      metadata: {
        userId: req.user.id,
        email: req.user.email,
      },
    } as any);

    logger.info(
      { userId: req.user.id, checkoutId: checkout.id, checkout },
      "Checkout created",
    );

    // The checkout URL should be in the response
    const checkoutUrl = (checkout as any).url || (checkout as any).clientSecret;

    if (!checkoutUrl) {
      logger.error({ checkout }, "No checkout URL found in response");
      return res.status(500).json({ error: "Failed to generate checkout URL" });
    }

    return res.json({ checkoutUrl });
  } catch (error) {
    // Try to extract provider error details for easier debugging
    const err = error as any;
    const providerError = err?.response?.data || err?.body || err?.message;
    logger.error({ error: err, providerError }, "Failed to create checkout");
    res.status(500).json({ error: "Failed to create checkout" });
  }
};

export const handleWebhook = async (
  event: any,
  rawBody: string,
  headers: any,
  res: Response,
) => {
  try {
    const webhookSignature = headers["webhook-signature"] as string;
    const webhookId = headers["webhook-id"] as string;
    const webhookTimestamp = headers["webhook-timestamp"] as string;

    if (!webhookSignature || !webhookId || !webhookTimestamp) {
      logger.warn(
        { webhookSignature, webhookId, webhookTimestamp },
        "Missing webhook headers for signature verification",
      );
      return res.status(401).json({ error: "Missing webhook headers" });
    }

    // Polar uses Svix-style signature verification
    // Format: v1,<signature>
    // We need to verify: ID.timestamp.body
    const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;

    const hmac = crypto.createHmac("sha256", config.polar.webhookSecret);
    hmac.update(signedContent);
    const expectedSignature = hmac.digest("base64");

    // Extract the signature part (after v1,)
    const [version, signature] = webhookSignature.split(",");

    logger.info(
      {
        version,
        signature,
        expectedSignature,
        match: signature === expectedSignature,
      },
      "Webhook signature verification",
    );

    if (signature !== expectedSignature) {
      logger.warn(
        { signature, expectedSignature },
        "Invalid webhook signature",
      );
      return res.status(401).json({ error: "Unauthorized" });
    }

    logger.info({ eventType: event.type }, "Webhook event received");

    // Handle subscription active - grant access to Pro features
    if (event.type === "subscription.active") {
      const metadata = event.data.metadata as {
        userId?: string;
        email?: string;
      };

      if (!metadata.userId) {
        logger.warn({ event }, "No userId in webhook metadata");
        return res.status(400).json({ error: "Missing userId in metadata" });
      }

      // Update user as paid
      await db
        .update(usersTable)
        .set({ isPaid: true })
        .where(eq(usersTable.id, metadata.userId));

      logger.info(
        { userId: metadata.userId, subscriptionId: event.data.id },
        "User subscription activated - upgraded to Pro",
      );
    }

    // Handle subscription canceled - revoke Pro access
    if (event.type === "subscription.canceled") {
      const metadata = event.data.metadata as {
        userId?: string;
        email?: string;
      };

      if (!metadata.userId) {
        logger.warn({ event }, "No userId in webhook metadata");
        return res.status(400).json({ error: "Missing userId in metadata" });
      }

      // Update user as not paid
      await db
        .update(usersTable)
        .set({ isPaid: false })
        .where(eq(usersTable.id, metadata.userId));

      logger.info(
        { userId: metadata.userId, subscriptionId: event.data.id },
        "User subscription canceled - revoked Pro access",
      );
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error({ error }, "Webhook processing error");
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
