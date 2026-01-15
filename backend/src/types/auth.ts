import { Request } from "express";
import { usersTable } from "../db/schema";

// Infer User type from Drizzle schema
type User = typeof usersTable.$inferSelect;

export type AuthPayload = Omit<User, "password">;

declare global {
  namespace Express {
    interface User extends AuthPayload {}
  }
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
  body: Record<string, any>;
  params: Record<string, string>;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    isPaid: boolean;
  };
  message: string;
}

export interface ArticleResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
