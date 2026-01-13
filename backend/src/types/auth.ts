import type { User } from "@prisma/client";
import { Request } from "express";

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
