import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema.js";
import { logger } from "./logger.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  logger.error("DATABASE_URL environment variable is not set");
  throw new Error("DATABASE_URL environment variable is not set");
}

logger.info("Creating PostgreSQL connection pool...");

const pool = new Pool({
  connectionString,
});

// Test the connection
pool.on("connect", () => {
  logger.info("PostgreSQL connection established");
});

pool.on("error", (err) => {
  logger.error({ error: err }, "PostgreSQL connection error");
});

pool.on("remove", () => {
  logger.info("PostgreSQL connection removed from pool");
});

// Test initial connection
pool
  .query("SELECT 1")
  .then(() => {
    logger.info("PostgreSQL database connection verified");
  })
  .catch((err) => {
    logger.error({ error: err }, "Failed to verify PostgreSQL connection");
  });

export const db = drizzle(pool, { schema });

export { pool };
