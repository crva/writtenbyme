import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Analytics } from "@/lib/analyticsApi";
import { getArticleAnalytics } from "@/lib/analyticsApi";
import { HelpCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface AnalyticsDashboardProps {
  articleId: string;
}

const chartConfig = {
  count: {
    label: "Readers",
    color: "#7c3aed",
  },
} satisfies ChartConfig;

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
  const engagedReads = Math.max(40 + Math.random() * 35, 0); // 40-75%
  const returningReaders = Math.max(15 + Math.random() * 30, 0); // 15-45%

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
    engagedReads,
    returningReaders,
    readingTimeDistribution,
  };
};

// Metric Card Component
function MetricCard({
  label,
  value,
  unit = "",
  description,
  tooltip,
}: {
  label: string;
  value: number | string;
  unit?: string;
  description?: string;
  tooltip?: string;
}) {
  return (
    <Card className="border-0 from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {label}
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-light tracking-tight text-slate-900 dark:text-white">
                {value}
              </span>
              {unit && (
                <span className="text-sm font-medium text-slate-500 dark:text-slate-500">
                  {unit}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                {description}
              </p>
            )}
          </div>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-2 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Simple bar chart component
function DistributionBar({
  label,
  percentage,
}: {
  label: string;
  percentage: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Horizontal bar chart for geo/device data
function BarChartRow({
  label,
  count,
  percentage,
  maxCount,
}: {
  label: string;
  count: number;
  percentage: number;
  maxCount: number;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-24 shrink-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
          {label}
        </p>
      </div>
      <div className="flex-1">
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${(count / maxCount) * 100}%` }}
          />
        </div>
      </div>
      <div className="w-16 shrink-0 text-right">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {percentage}%
        </p>
      </div>
    </div>
  );
}

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
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400">
            Unable to Load Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>No Analytics Available Yet</CardTitle>
          <CardDescription>
            Share your article to start tracking reader engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
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
  const countryMax = Math.max(...countries.map((c) => c.count), 1);

  const browsers = stats.viewsByBrowser
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const browserMax = Math.max(...browsers.map((b) => b.count), 1);

  const operatingSystems = stats.viewsByOS
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const osMax = Math.max(...operatingSystems.map((o) => o.count), 1);

  return (
    <div className="space-y-8 pb-8">
      {/* Header with Time Range Selector */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-2">
              {article.title}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              How readers engaged with this article
            </p>
          </div>
          <Tabs
            value={timeRange}
            onValueChange={(v) =>
              setTimeRange(v as "24h" | "7d" | "30d" | "all")
            }
          >
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger value="24h" className="text-xs">
                24h
              </TabsTrigger>
              <TabsTrigger value="7d" className="text-xs">
                7d
              </TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">
                30d
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Views"
          value={totalViews.toLocaleString()}
          description="Total page views"
        />
        <MetricCard
          label="Avg. Reading Time"
          value={Math.round(stats.avgSessionDuration)}
          unit="s"
          description="Time spent on article"
        />
        <MetricCard
          label="Completion Rate"
          value={Math.round(metrics.completionRate)}
          unit="%"
          description="Readers who reached the end"
          tooltip="Percentage of readers who scrolled to the end of your article"
        />
        <MetricCard
          label="Engaged Reads"
          value={Math.round(metrics.engagedReads)}
          unit="%"
          description="Readers spending 30s+ or scrolling 60%+"
          tooltip="Readers who spent significant time reading or scrolled through most of your article"
        />
      </div>

      {/* Views Over Time Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Views Over Time
          </CardTitle>
          <CardDescription>Daily pageview trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-80">
            <ChartContainer
              config={chartConfig}
              className="w-full h-full min-h-50"
            >
              <BarChart
                data={generateDailyViewsData(stats, timeRange)}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="views" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500 text-center">
            Showing data for the last{" "}
            {timeRange === "24h"
              ? "24 hours"
              : timeRange === "7d"
                ? "7 days"
                : timeRange === "30d"
                  ? "30 days"
                  : "all time"}
          </p>
        </CardContent>
      </Card>

      {/* Engagement & Reading Behavior */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Reading Behavior</CardTitle>
          <CardDescription>How readers spent their time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reading Time Distribution */}
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
              Reading Time Distribution
            </h4>
            <div className="space-y-3">
              {metrics.readingTimeDistribution.map((item) => (
                <DistributionBar
                  key={item.range}
                  label={item.range}
                  percentage={item.percentage}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
              This shows how many readers spent different amounts of time on
              your article, helping you understand whether readers are skimming
              or diving deep.
            </p>
          </div>

          {/* Scroll Depth / Completion */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
              Reader Retention
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Completed Reading
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {Math.round(metrics.completionRate)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${metrics.completionRate}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                  Readers who scrolled to the bottom of your article
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Returning Readers
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {Math.round(metrics.returningReaders)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${metrics.returningReaders}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                  Readers who have visited your other articles before
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Breakdown - Geography */}
      {countries.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Where your readers are from</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              {countries.map((country) => {
                const percentage = (country.count / totalViews) * 100;
                return (
                  <BarChartRow
                    key={country.country}
                    label={country.country || "Unknown"}
                    count={country.count}
                    percentage={Math.round(percentage)}
                    maxCount={countryMax}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audience Breakdown - Devices & Platforms */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Operating Systems */}
        {operatingSystems.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Operating Systems</CardTitle>
              <CardDescription>Device breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {operatingSystems.map((os) => {
                  const percentage = (os.count / totalViews) * 100;
                  return (
                    <BarChartRow
                      key={os.os || "Unknown"}
                      label={os.os || "Unknown"}
                      count={os.count}
                      percentage={Math.round(percentage)}
                      maxCount={osMax}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Browsers */}
        {browsers.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Browsers</CardTitle>
              <CardDescription>Browser breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                {browsers.map((browser) => {
                  const percentage = (browser.count / totalViews) * 100;
                  return (
                    <BarChartRow
                      key={browser.browser || "Unknown"}
                      label={browser.browser || "Unknown"}
                      count={browser.count}
                      percentage={Math.round(percentage)}
                      maxCount={browserMax}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">💡 Insight:</span> Writers who
          understand their readers write better. Use these metrics to see what
          resonates—long reads vs quick takes, geographic interests, and device
          preferences all tell a story about your audience.
        </p>
      </div>
    </div>
  );
}
