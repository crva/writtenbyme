import { articlesTable } from "../db/schema";

// Infer Article type from Drizzle schema
type Article = typeof articlesTable.$inferSelect;

export type ArticleResponse = Omit<Article, "userId">;

export type CreateArticlePayload = {
  title: string;
  content: string;
};

export type UpdateArticlePayload = {
  title?: string;
  content?: string;
};

export interface ArticleListResponse {
  id: string;
  slug: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}

export interface ArticleDetailResponse extends ArticleListResponse {
  content: string;
  author: string;
}
