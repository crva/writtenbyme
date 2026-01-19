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
    avgScrollPercentage: number;
    completionRate: number;
    readingTimeDistribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    dailyViews: Array<{
      day: string;
      views: number;
    }>;
    viewsByCountry: Array<{ country: string; count: number }>;
    viewsByOS: Array<{ os: string; count: number }>;
    viewsByBrowser: Array<{ browser: string; count: number }>;
  };
}

export async function trackArticleView(
  articleId: string,
  sessionDuration?: number,
  maxScrollPercentage?: number,
) {
  try {
    await apiPost(`/articles/${articleId}/track`, {
      sessionDuration,
      maxScrollPercentage,
    });
  } catch {
    // Silently fail to avoid disrupting user experience
  }
}

export async function getArticleAnalytics(
  articleId: string,
  timeRange: "24h" | "7d" | "30d" | "all" = "7d",
): Promise<Analytics> {
  return apiGet<Analytics>(
    `/articles/${articleId}/analytics?timeRange=${timeRange}`,
  );
}
