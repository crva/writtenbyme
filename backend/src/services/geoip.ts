import geoip from "geoip-lite";
import { logger } from "../lib/logger.js";

export function getCountryFromIP(ipAddress: string): string | null {
  try {
    // Remove IPv6 prefix if present
    let ip = ipAddress;
    if (ip.includes("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }

    const geo = geoip.lookup(ip);
    if (geo && geo.country) {
      return geo.country;
    }
    return null;
  } catch (error) {
    logger.error({ ipAddress, error }, "Error getting country from IP");
    return null;
  }
}
