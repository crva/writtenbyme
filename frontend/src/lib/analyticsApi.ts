import { apiGet, apiPost } from "./api";

export interface Analytics {
  article: {
    id: string;
    title: string;
    slug: string;
  };
  stats: {
    totalViews: number;
    avgSessionDuration: number;
    viewsByCountry: Array<{ country: string; count: number }>;
    viewsByOS: Array<{ os: string; count: number }>;
    viewsByBrowser: Array<{ browser: string; count: number }>;
    viewsOverTime: { [date: string]: number };
  };
}

export async function trackArticleView(
  articleId: string,
  sessionDuration?: number
) {
  try {
    await apiPost(`/articles/${articleId}/track`, {
      sessionDuration,
    });
  } catch {
    // Silently fail to avoid disrupting user experience
  }
}

export async function getArticleAnalytics(
  articleId: string
): Promise<Analytics | null> {
  try {
    const response = await apiGet<Analytics>(
      `/articles/${articleId}/analytics`
    );
    return response;
  } catch {
    return null;
  }
}
