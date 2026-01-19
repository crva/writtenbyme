import pgSession from "connect-pg-simple";
import session from "express-session";
import { Pool } from "pg";
import { logger } from "../lib/logger.js";
import { config } from "./config.js";

logger.info("Creating PostgreSQL session pool...");

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pgPool.on("connect", () => {
  logger.info("PostgreSQL session pool connection established");
});

pgPool.on("error", (err) => {
  logger.error({ error: err }, "PostgreSQL session pool connection error");
});

logger.info("Initializing session store...");

const sessionStore = new (pgSession(session))({
  pool: pgPool,
  tableName: "Session",
  createTableIfMissing: true,
});

sessionStore.on("connect", () => {
  logger.info("Session store connected to PostgreSQL");
});

sessionStore.on("error", (err) => {
  logger.error({ error: err }, "Session store PostgreSQL error");
});

export const sessionMiddleware = session({
  store: sessionStore,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !config.isDev,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax",
  },
});

export { sessionStore };
