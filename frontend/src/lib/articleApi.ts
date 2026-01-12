/**
 * Article API endpoints
 * Handles all article CRUD operations
 */

import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { Article } from "@/types/article";

export interface ArticleResponse extends Omit<Article, "id"> {
  id: string;
  slug: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateArticlePayload = {
  title: string;
  content: string;
};

export type UpdateArticlePayload = {
  title?: string;
  content?: string;
};

/**
 * Create a new article
 */
export const createArticle = (payload: CreateArticlePayload) =>
  apiPost<{ article: ArticleResponse }>(
    "/articles",
    payload as Record<string, unknown>
  );

/**
 * Get current user's articles
 */
export const getMyArticles = () =>
  apiGet<{ articles: ArticleResponse[] }>("/articles/me");

/**
 * Get all articles by username
 */
export const getUserArticles = (username: string) =>
  apiGet<{ articles: ArticleResponse[] }>(`/articles/${username}`);

/**
 * Get a specific article by username and slug
 */
export const getArticleBySlug = (username: string, slug: string) =>
  apiGet<{ article: ArticleResponse }>(`/articles/${username}/${slug}`);

/**
 * Update an article
 */
export const updateArticle = (id: string, payload: UpdateArticlePayload) =>
  apiPut<{ article: ArticleResponse }>(
    `/articles/${id}`,
    payload as Record<string, unknown>
  );

/**
 * Delete an article
 */
export const deleteArticle = (id: string) =>
  apiDelete<{ success: boolean }>(`/articles/${id}`);
