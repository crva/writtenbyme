import { Request } from "express";

export interface AuthPayload {
  userId: string;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
  body: Record<string, any>;
  params: Record<string, string>;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ArticleResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
