import { Resend } from "resend";
import { config } from "../config/config";
import { logger } from "./logger";

const resend = new Resend(config.resend.apiKey);

export async function sendMagicLinkEmail(
  email: string,
  magicLink: string
): Promise<void> {
  try {
    if (!config.resend.apiKey) {
      logger.warn("RESEND_API_KEY not configured, skipping email send");
      return;
    }

    // In development, just log the magic link instead of sending
    if (config.isDev) {
      logger.debug({ email, magicLink }, "Magic link created");
      return;
    }

    const response = await resend.emails.send({
      from: "WrittenByMe <noreply@writtenbyme.com>",
      to: email,
      subject: "Your WrittenByMe Sign-In Link",
      html: generateMagicLinkTemplate(magicLink),
    });

    if (response.error) {
      logger.error(
        { error: response.error, email },
        "Failed to send magic link email"
      );
      throw new Error(`Failed to send email: ${response.error.message}`);
    }

    logger.info(
      { email, messageId: response.data?.id },
      "Magic link email sent"
    );
  } catch (error) {
    logger.error({ error, email }, "Error sending magic link email");
    throw error;
  }
}

function generateMagicLinkTemplate(magicLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            color: #000;
            font-size: 24px;
          }
          .content {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: #000;
            color: #fff;
            padding: 12px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #333;
          }
          .link-text {
            word-break: break-all;
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 30px;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 4px;
            padding: 12px;
            margin: 20px 0;
            color: #856404;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>WrittenByMe</h1>
          </div>

          <div class="content">
            <p>Hi there,</p>
            
            <p>Welcome to WrittenByMe! Click the button below to sign in to your account. This link will expire in 15 minutes.</p>

            <div style="text-align: center;">
              <a href="${magicLink}" class="button">Sign In to WrittenByMe</a>
            </div>

            <p>Or copy and paste this link in your browser:</p>
            <div class="link-text">${magicLink}</div>

            <div class="warning">
              <strong>Security Note:</strong> This link is unique to you. If you didn't request this email, please ignore it. Never share this link with anyone.
            </div>

            <p>Questions? We're here to help at support@writtenbyme.com</p>
          </div>

          <div class="footer">
            <p>© 2026 WrittenByMe. All rights reserved.</p>
            <p>You received this email because a sign-in request was made for this email address.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
