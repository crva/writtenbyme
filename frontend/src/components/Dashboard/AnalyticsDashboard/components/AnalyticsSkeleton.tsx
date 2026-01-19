import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsSkeletonProps {
  title: string;
  timeRange: "24h" | "7d" | "30d" | "all";
}

export function AnalyticsSkeleton({
  title,
  timeRange,
}: AnalyticsSkeletonProps) {
  return (
    <div className="space-y-8 pb-8">
      {/* Header - Not skeleton, just disabled */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight mb-2">{title}</h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              How readers engaged with this article
            </p>
          </div>
          <Tabs value={timeRange} onValueChange={() => {}}>
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 opacity-50">
              <TabsTrigger value="24h" className="text-xs" disabled>
                24h
              </TabsTrigger>
              <TabsTrigger value="7d" className="text-xs" disabled>
                7d
              </TabsTrigger>
              <TabsTrigger value="30d" className="text-xs" disabled>
                30d
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs" disabled>
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16 mb-4" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>

      {/* Reading Behavior Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geography Skeleton */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-1.5 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Breakdown Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex gap-4 items-center">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-1.5 flex-1" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
