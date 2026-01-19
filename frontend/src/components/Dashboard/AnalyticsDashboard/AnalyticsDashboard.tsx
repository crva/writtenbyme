import { Card, CardContent } from "@/components/ui/card";
import type { Analytics } from "@/lib/analyticsApi";
import { getArticleAnalytics } from "@/lib/analyticsApi";
import { useEffect, useState } from "react";
import {
  AnalyticsFooter,
  AnalyticsHeader,
  AnalyticsSkeleton,
  DeviceBreakdown,
  GeographyBreakdown,
  MetricsGrid,
  ReadingBehavior,
  ViewsChart,
} from "./components";

interface AnalyticsDashboardProps {
  articleId: string;
  title: string;
}

// Simulated computed metrics (would come from backend in production)
const computeMetrics = (stats: Analytics["stats"]) => {
  return {
    completionRate: stats.completionRate,
    avgScrollPercentage: stats.avgScrollPercentage,
    readingTimeDistribution: stats.readingTimeDistribution,
  };
};

export default function AnalyticsDashboard({
  articleId,
  title,
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
        const data = await getArticleAnalytics(articleId, timeRange);
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
  }, [articleId, timeRange]);

  if (loading) {
    return <AnalyticsSkeleton title={title} timeRange={timeRange} />;
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

  const chartData = stats.dailyViews;

  return (
    <div className="space-y-8">
      <AnalyticsHeader
        title={article.title}
        timeRange={timeRange}
        onTimeRangeChange={(v) => setTimeRange(v)}
      />

      <MetricsGrid
        totalViews={totalViews}
        avgSessionDuration={stats.avgSessionDuration}
        completionRate={metrics.completionRate}
        avgScrollPercentage={metrics.avgScrollPercentage}
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
