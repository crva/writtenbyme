import { Polar } from "@polar-sh/sdk";
import { config } from "../config/config.js";

// Initialize Polar SDK with environment-specific server URL
export const polar = new Polar({
  accessToken: config.polar.accessToken,
  serverURL: config.isDev
    ? "https://sandbox-api.polar.sh"
    : "https://api.polar.sh",
});
