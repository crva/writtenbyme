import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Analytics } from "@/lib/analyticsApi";
import { getArticleAnalytics } from "@/lib/analyticsApi";
import { useEffect, useState } from "react";

interface AnalyticsDashboardProps {
  articleId: string;
}

export default function AnalyticsDashboard({
  articleId,
}: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            "Failed to fetch analytics. Make sure you own this article."
          );
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error loading analytics";
        setError(errorMsg);
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [articleId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Analytics Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No view data available yet. Share your article to start tracking
            views.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { stats } = analytics;

  return (
    <div className="space-y-4">
      {/* Total Views Card */}
      <Card>
        <CardHeader>
          <CardTitle>Views</CardTitle>
          <CardDescription>Total page views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalViews}</div>
        </CardContent>
      </Card>

      {/* Average Session Duration */}
      <Card>
        <CardHeader>
          <CardTitle>Average Reading Time</CardTitle>
          <CardDescription>Time spent on article</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.avgSessionDuration}s</div>
        </CardContent>
      </Card>

      {/* Views by Country */}
      {stats.viewsByCountry.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Where your readers are from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.viewsByCountry.slice(0, 5).map((country) => (
                <div key={country.country} className="flex justify-between">
                  <span className="text-sm">{country.country}</span>
                  <span className="text-sm font-semibold">{country.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Views by OS */}
      {stats.viewsByOS.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Operating Systems</CardTitle>
            <CardDescription>Breakdown by OS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.viewsByOS.map((os) => (
                <div key={os.os || "Unknown"} className="flex justify-between">
                  <span className="text-sm">{os.os || "Unknown"}</span>
                  <span className="text-sm font-semibold">{os.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Views by Browser */}
      {stats.viewsByBrowser.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
            <CardDescription>Breakdown by browser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.viewsByBrowser.map((browser) => (
                <div
                  key={browser.browser || "Unknown"}
                  className="flex justify-between"
                >
                  <span className="text-sm">
                    {browser.browser || "Unknown"}
                  </span>
                  <span className="text-sm font-semibold">{browser.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
