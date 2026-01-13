export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  sessionSecret: process.env.SESSION_SECRET || "your-session-secret-key",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  isDev: process.env.NODE_ENV !== "production",
};
