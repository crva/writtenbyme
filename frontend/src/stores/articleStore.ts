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
  currentArticle: Article | null;
  loading: boolean;
  hasFetched: boolean;
  articleError: string | null;
  addArticle: (title: string) => Promise<{
    error?: string;
    success?: boolean;
    id?: string;
    slug?: string;
  }>;
  removeArticle: (id: string) => Promise<void>;
  updateArticleContent: (id: string, content: string) => void;
  updateArticleTitle: (id: string, title: string) => void;
  setSelectedArticle: (id: string | null) => void;
  saveChanges: (id: string) => Promise<{
    error?: string;
    success?: boolean;
    id?: string;
    slug?: string;
  }>;
  discardChanges: (id: string) => void;
  fetchArticles: () => Promise<void>;
  fetchUserArticles: (username: string) => Promise<void>;
  fetchArticleBySlug: (username: string, slug: string) => Promise<void>;
  clearCurrentArticle: () => void;
  resetStore: () => void;
};


export const useArticle = create<ArticleStore>((set, get) => ({
  articles: [],
  selectedArticleId: null,
  unsavedChanges: {},
  originalContent: {},
  currentArticle: null,
  loading: false,
  hasFetched: false,
  articleError: null,

  addArticle: async (title: string) => {
    try {
      const response = await createArticle({
        title: title,
        content: "",
      });

      const newArticle = {
        id: response.article.id,
        title: response.article.title,
        content: response.article.content,
        slug: response.article.slug,
        createdAt: response.article.createdAt,
        updatedAt: response.article.updatedAt,
      };

      set((state) => ({
        articles: [newArticle, ...state.articles],
        selectedArticleId: response.article.id,
      }));

      return { success: true, id: response.article.id, slug: response.article.slug };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create article";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  },

  removeArticle: async (id: string) => {
    try {
      await deleteArticle(id);
      set((state) => ({
        articles: state.articles.filter((article) => article.id !== id),
        selectedArticleId:
          state.selectedArticleId === id ? null : state.selectedArticleId,
        unsavedChanges: Object.fromEntries(
          Object.entries(state.unsavedChanges).filter(([key]) => key !== id),
        ),
        originalContent: Object.fromEntries(
          Object.entries(state.originalContent).filter(([key]) => key !== id),
        ),
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete article";
      throw new Error(errorMessage);
    }
  },

  updateArticleContent: (id: string | number, content: string) =>
    set((state) => {
      const originalContent = state.originalContent[id];
      const hasOriginal = originalContent !== undefined;

      return {
        articles: state.articles.map((article) =>
          article.id === id ? { ...article, content } : article,
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
        article.id === id ? { ...article, title } : article,
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
            : a,
        ),
        unsavedChanges: Object.fromEntries(
          Object.entries(currentState.unsavedChanges).filter(
            ([key]) => key !== id,
          ),
        ),
        originalContent: Object.fromEntries(
          Object.entries(currentState.originalContent).filter(
            ([key]) => key !== id,
          ),
        ),
      }));
      return { success: true, id, slug: response.article.slug };
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
            : article,
        ),
        unsavedChanges: newChanges,
        originalContent: newOriginalContent,
      };
    }),

  fetchArticles: async () => {
    try {
      // Only show loading skeleton if we have no articles yet
      set((currentState) =>
        currentState.articles.length === 0 ? { loading: true } : {},
      );
      const response = await getMyArticles();

      // Handle both array response and wrapped response
      const fetched = Array.isArray(response)
        ? response
        : response.articles || [];

      set({
        articles: fetched,
        loading: false,
        hasFetched: true,
      });
    } catch {
      toast.error("Failed to fetch articles");
      set({ loading: false, hasFetched: true });
    }
  },

  fetchUserArticles: async (username: string) => {
    try {
      set({ loading: true });
      const response = await getUserArticles(username);

      const articles = Array.isArray(response)
        ? response
        : response.articles || [];

      set({
        articles: articles.map((article) => ({
          ...article,
          content: "",
        })),
        loading: false,
      });
    } catch {
      set({ articles: [], loading: false });
      // Redirect to homepage on error (unknown username)
      window.location.href = "/";
    }
  },

  fetchArticleBySlug: async (username: string, slug: string) => {
    try {
      set({ loading: true, articleError: null });
      const response = await getArticleBySlug(username, slug);

      set({
        currentArticle: {
          id: response.article.id,
          title: response.article.title,
          slug: response.article.slug,
          content: response.article.content,
          status: response.article.status,
          createdAt: response.article.createdAt,
          updatedAt: response.article.updatedAt,
          author: response.article.author,
        },
        loading: false,
        articleError: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch article";
      
      // Check if it's a locked article error
      if (errorMessage.includes("locked")) {
        set({ 
          currentArticle: null, 
          loading: false,
          articleError: "This article is locked and not accessible."
        });
      } else {
        set({ currentArticle: null, loading: false, articleError: errorMessage });
        // Redirect to homepage on other errors
        window.location.href = "/";
      }
    }
  },

  clearCurrentArticle: () => set({ currentArticle: null }),

  resetStore: () =>
    set({
      articles: [],
      selectedArticleId: null,
      unsavedChanges: {},
      originalContent: {},
      currentArticle: null,
      loading: false,
      hasFetched: false,
      articleError: null,
    }),
}));
