import { UAParser } from "ua-parser-js";
import { logger } from "../lib/logger.js";

export interface ParsedUserAgent {
  os: string | null;
  browser: string | null;
  device: string | null;
}

export function parseUserAgent(userAgentString: string): ParsedUserAgent {
  try {
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    return {
      os: result.os.name || null,
      browser: result.browser.name || null,
      device: result.device.type || "desktop",
    };
  } catch (error) {
    logger.error({ userAgentString, error }, "Error parsing user agent");
    return {
      os: null,
      browser: null,
      device: null,
    };
  }
}
