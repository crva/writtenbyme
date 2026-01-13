import pino from "pino";
import { config } from "../config";

const isDev = config.nodeEnv === "development";

// Create logger with environment-specific configuration
export const logger = pino(
  {
    level: isDev ? "debug" : "info",
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
      bindings: (bindings) => {
        return {
          pid: bindings.pid,
          host: bindings.hostname,
        };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  // Use pretty printing in development, JSON in production
  isDev
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          singleLine: false,
          messageFormat: "{msg}",
        },
      })
    : undefined
);

export default logger;
