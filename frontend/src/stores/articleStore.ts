import {
  createArticle,
  deleteArticle,
  getArticleBySlug,
  getMyArticles,
  getUserArticles,
  updateArticle,
} from "@/lib/articleApi";
import type { Article } from "@/types/article";
import { toast } from "sonner";
import { create } from "zustand";

type ArticleStore = {
  articles: Article[];
  selectedArticleId: string | null;
  unsavedChanges: Record<string, string>;
  originalContent: Record<string, string>;
  newArticles: Set<string>; // Track temporary IDs of articles not yet saved to API
  currentArticle: (Article & { author: string }) | null;
  loading: boolean;
  addArticle: (title: string) => void;
  removeArticle: (id: string) => void;
  updateArticleContent: (id: string, content: string) => void;
  updateArticleTitle: (id: string, title: string) => void;
  setSelectedArticle: (id: string | null) => void;
  saveChanges: (id: string) => Promise<{ error?: string; success?: boolean }>;
  discardChanges: (id: string) => void;
  fetchArticles: () => Promise<void>;
  fetchUserArticles: (username: string) => Promise<void>;
  fetchArticleBySlug: (username: string, slug: string) => Promise<void>;
};

/**
 * Generate a temporary ID for new articles
 * Format: temp-{timestamp}-{random}
 */
function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useArticle = create<ArticleStore>((set, get) => ({
  articles: [],
  selectedArticleId: null,
  unsavedChanges: {},
  originalContent: {},
  newArticles: new Set(),
  currentArticle: null,
  loading: false,

  addArticle: (title: string) =>
    set((state) => {
      const tempId = generateTempId();
      const newArticles = new Set(state.newArticles);
      newArticles.add(tempId);

      return {
        articles: [
          ...state.articles,
          {
            id: tempId,
            title: title,
            content: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        newArticles,
      };
    }),

  removeArticle: (id: string) =>
    set((state) => {
      // Only call API if it's not a temporary article
      if (!state.newArticles.has(id)) {
        deleteArticle(id).catch((error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete article";
          toast.error(errorMessage);
        });
      }

      const newArticles = new Set(state.newArticles);
      newArticles.delete(id);

      return {
        articles: state.articles.filter((article) => article.id !== id),
        selectedArticleId:
          state.selectedArticleId === id ? null : state.selectedArticleId,
        unsavedChanges: Object.fromEntries(
          Object.entries(state.unsavedChanges).filter(([key]) => key !== id)
        ),
        originalContent: Object.fromEntries(
          Object.entries(state.originalContent).filter(([key]) => key !== id)
        ),
        newArticles,
      };
    }),

  updateArticleContent: (id: string | number, content: string) =>
    set((state) => {
      const originalContent = state.originalContent[id];
      const hasOriginal = originalContent !== undefined;

      return {
        articles: state.articles.map((article) =>
          article.id === id ? { ...article, content } : article
        ),
        unsavedChanges: {
          ...state.unsavedChanges,
          [id]: content,
        },
        originalContent: !hasOriginal
          ? {
              ...state.originalContent,
              [id]: state.articles.find((a) => a.id === id)?.content || "",
            }
          : state.originalContent,
      };
    }),

  updateArticleTitle: (id: string | number, title: string) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id ? { ...article, title } : article
      ),
    })),

  setSelectedArticle: (id: string | null) =>
    set(() => ({
      selectedArticleId: id,
    })),

  saveChanges: async (id: string) => {
    try {
      const state = get();
      const article = state.articles.find((a) => a.id === id);

      if (!article) {
        return { error: "Article not found" };
      }

      if (state.newArticles.has(id)) {
        // Create new article
        const response = await createArticle({
          title: article.title,
          content: article.content,
        });

        // Replace temporary ID with real API ID
        const realId = response.article.id;
        set((currentState) => {
          const newArticles = new Set(currentState.newArticles);
          newArticles.delete(id);

          // Replace the temporary ID with the real ID in all records
          const updatedArticles = currentState.articles.map((a) =>
            a.id === id
              ? {
                  ...a,
                  id: realId,
                  title: response.article.title,
                  slug: response.article.slug,
                  content: response.article.content,
                }
              : a
          );

          const updatedUnsavedChanges = Object.fromEntries(
            Object.entries(currentState.unsavedChanges).filter(
              ([key]) => key !== id
            )
          );

          const updatedOriginalContent = Object.fromEntries(
            Object.entries(currentState.originalContent).filter(
              ([key]) => key !== id
            )
          );

          return {
            articles: updatedArticles,
            selectedArticleId:
              currentState.selectedArticleId === id
                ? realId
                : currentState.selectedArticleId,
            unsavedChanges: updatedUnsavedChanges,
            originalContent: updatedOriginalContent,
            newArticles,
          };
        });
        return { success: true };
      } else {
        // Update existing article
        const response = await updateArticle(String(article.id), {
          title: article.title,
          content: article.content,
        });

        set((currentState) => ({
          articles: currentState.articles.map((a) =>
            a.id === id
              ? {
                  ...a,
                  title: response.article.title,
                  slug: response.article.slug,
                  content: response.article.content,
                }
              : a
          ),
          unsavedChanges: Object.fromEntries(
            Object.entries(currentState.unsavedChanges).filter(
              ([key]) => key !== id
            )
          ),
          originalContent: Object.fromEntries(
            Object.entries(currentState.originalContent).filter(
              ([key]) => key !== id
            )
          ),
        }));
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save article";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  },

  discardChanges: (id: string) =>
    set((state) => {
      const originalContent = state.originalContent[id];
      const newChanges = { ...state.unsavedChanges };
      const newOriginalContent = { ...state.originalContent };
      delete newChanges[id];
      delete newOriginalContent[id];

      return {
        articles: state.articles.map((article) =>
          article.id === id && originalContent !== undefined
            ? { ...article, content: originalContent }
            : article
        ),
        unsavedChanges: newChanges,
        originalContent: newOriginalContent,
      };
    }),

  fetchArticles: async () => {
    try {
      const response = await getMyArticles();

      // Handle both array response and wrapped response
      const articles = Array.isArray(response)
        ? response
        : response.articles || [];

      set({
        articles,
        newArticles: new Set(), // Clear new articles since we just fetched from API
      });
    } catch {
      toast.error("Failed to fetch articles");
    }
  },

  fetchUserArticles: async (username: string) => {
    try {
      set({ loading: true });
      const response = await getUserArticles(username);

      const articles = Array.isArray(response)
        ? response
        : response.articles || [];

      set({ articles, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch articles";
      toast.error(errorMessage);
      set({ articles: [], loading: false });
    }
  },

  fetchArticleBySlug: async (username: string, slug: string) => {
    try {
      set({ loading: true });
      const response = await getArticleBySlug(username, slug);

      set({
        currentArticle: { ...response.article, author: username },
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch article";
      toast.error(errorMessage);
      set({ currentArticle: null, loading: false });
    }
  },
}));
