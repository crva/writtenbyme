import { Request } from "express";
import { AuthPayload } from "./user";

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
