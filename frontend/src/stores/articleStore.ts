import type { Article } from "@/types/article";
import { create } from "zustand";

type ArticleStore = {
  articles: Article[];
  nextId: number;
  selectedArticleId: number | null;
  unsavedChanges: Record<number, string>;
  originalContent: Record<number, string>;
  addArticle: () => void;
  removeArticle: (id: number) => void;
  updateArticleContent: (id: number, content: string) => void;
  updateArticleTitle: (id: number, title: string) => void;
  setSelectedArticle: (id: number | null) => void;
  saveChanges: (id: number) => void;
  discardChanges: (id: number) => void;
};

export const useArticle = create<ArticleStore>((set) => ({
  articles: [
    {
      id: 0,
      title: "Lorem Ipsum",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eleifend purus quis magna hendrerit porta ut sed felis. Sed consectetur vehicula urna, at ullamcorper nibh fermentum nec. Praesent congue tincidunt est, id volutpat nunc. Duis dolor arcu, volutpat eget euismod a, consectetur vitae orci. Aliquam a neque nibh. Aliquam sit amet suscipit ipsum. Fusce sit amet mi turpis. Suspendisse potenti.`,
    },
    {
      id: 1,
      title: "Lorem Ipsum 2",
      content: `bjr.`,
    },
  ],
  nextId: 2,
  selectedArticleId: null,
  unsavedChanges: {},
  originalContent: {},

  addArticle: () =>
    set((state) => ({
      articles: [
        ...state.articles,
        {
          id: state.nextId,
          title: "New article",
          content: "",
        },
      ],
      nextId: state.nextId + 1,
    })),

  removeArticle: (id: number) =>
    set((state) => ({
      articles: state.articles.filter((article) => article.id !== id),
      selectedArticleId:
        state.selectedArticleId === id ? null : state.selectedArticleId,
      unsavedChanges: Object.fromEntries(
        Object.entries(state.unsavedChanges).filter(
          ([key]) => Number(key) !== id
        )
      ),
    })),

  updateArticleContent: (id: number, content: string) =>
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

  updateArticleTitle: (id: number, title: string) =>
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id ? { ...article, title } : article
      ),
    })),

  setSelectedArticle: (id: number | null) =>
    set(() => ({
      selectedArticleId: id,
    })),

  saveChanges: (id: number) =>
    set((state) => {
      const newChanges = { ...state.unsavedChanges };
      const newOriginalContent = { ...state.originalContent };
      delete newChanges[id];
      delete newOriginalContent[id];
      return {
        unsavedChanges: newChanges,
        originalContent: newOriginalContent,
      };
    }),

  discardChanges: (id: number) =>
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
}));
