import { usersTable } from "../db/schema.js";

// Infer User type from Drizzle schema
export type User = typeof usersTable.$inferSelect;

export type AuthPayload = User;
