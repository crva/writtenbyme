import { usersTable } from "../db/schema";

// Infer User type from Drizzle schema
export type User = typeof usersTable.$inferSelect;

export type AuthPayload = Omit<User, "password">;

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};
