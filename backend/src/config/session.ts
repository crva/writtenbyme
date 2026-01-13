import pgSession from "connect-pg-simple";
import session from "express-session";
import { Pool } from "pg";
import { config } from "./config";

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sessionStore = new (pgSession(session))({
  pool: pgPool,
  tableName: "Session",
  createTableIfMissing: true,
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
