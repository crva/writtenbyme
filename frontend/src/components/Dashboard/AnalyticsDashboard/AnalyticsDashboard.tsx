import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Analytics } from "@/lib/analyticsApi";
import { getArticleAnalytics } from "@/lib/analyticsApi";
import { useEffect, useState } from "react";
import {
  AnalyticsFooter,
  AnalyticsHeader,
  DeviceBreakdown,
  GeographyBreakdown,
  MetricsGrid,
  ReadingBehavior,
  ViewsChart,
} from "./components";

interface AnalyticsDashboardProps {
  articleId: string;
}

// Generate daily views data for chart
const generateDailyViewsData = (
  _stats: Analytics["stats"],
  timeRange: "24h" | "7d" | "30d" | "all",
) => {
  let daysToShow = 7;

  if (timeRange === "24h") daysToShow = 1;
  else if (timeRange === "7d") daysToShow = 7;
  else if (timeRange === "30d") daysToShow = 30;
  else daysToShow = 90;

  const data = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = date.getDate();
    // Generate random views between 1 and 50
    const views = Math.floor(Math.random() * 50) + 1;
    data.push({
      day: `${dayName} ${dayNum}`,
      views: views,
    });
  }
  return data;
};

// Simulated computed metrics (would come from backend in production)
const computeMetrics = (stats: Analytics["stats"]) => {
  const totalViews = stats.totalViews || 0;

  // Simulate metrics that would be calculated server-side
  const completionRate = Math.max(30 + Math.random() * 40, 0); // 30-70%

  // Reading time distribution (simulated)
  const readingTimeDistribution = [
    { range: "< 10s", count: Math.floor(totalViews * 0.15), percentage: 15 },
    { range: "10–30s", count: Math.floor(totalViews * 0.25), percentage: 25 },
    { range: "30–60s", count: Math.floor(totalViews * 0.3), percentage: 30 },
    { range: "1–3 min", count: Math.floor(totalViews * 0.2), percentage: 20 },
    { range: "3+ min", count: Math.floor(totalViews * 0.1), percentage: 10 },
  ];

  return {
    completionRate,
    readingTimeDistribution,
  };
};

export default function AnalyticsDashboard({
  articleId,
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "all">(
    "7d",
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getArticleAnalytics(articleId);
        if (data) {
          setAnalytics(data);
          setError(null);
        } else {
          setError(
            "Failed to fetch analytics. Make sure you own this article.",
          );
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error loading analytics";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [articleId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Analytics will appear here once readers begin viewing your article.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { stats, article } = analytics;
  const metrics = computeMetrics(stats);
  const totalViews = stats.totalViews || 0;

  // Prepare data for display
  const countries = stats.viewsByCountry
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const browsers = stats.viewsByBrowser
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const operatingSystems = stats.viewsByOS
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const chartData = generateDailyViewsData(stats, timeRange);

  return (
    <div className="space-y-8 pb-8">
      <AnalyticsHeader
        title={article.title}
        timeRange={timeRange}
        onTimeRangeChange={(v) => setTimeRange(v)}
      />

      <MetricsGrid
        totalViews={totalViews}
        avgSessionDuration={stats.avgSessionDuration}
        completionRate={metrics.completionRate}
      />

      <ViewsChart data={chartData} timeRange={timeRange} />

      <ReadingBehavior
        readingTimeDistribution={metrics.readingTimeDistribution}
      />

      <GeographyBreakdown countries={countries} totalViews={totalViews} />

      <DeviceBreakdown
        operatingSystems={operatingSystems}
        browsers={browsers}
        totalViews={totalViews}
      />

      <AnalyticsFooter />
    </div>
  );
}
