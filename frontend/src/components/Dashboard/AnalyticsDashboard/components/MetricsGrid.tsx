import { MetricCard } from "./MetricCard";

interface MetricsGridProps {
  totalViews: number;
  avgSessionDuration: number;
  completionRate: number;
  avgScrollPercentage: number;
}

export function MetricsGrid({
  totalViews,
  avgSessionDuration,
  completionRate,
  avgScrollPercentage,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Views"
        value={totalViews.toLocaleString()}
        description="Total page views"
      />
      <MetricCard
        label="Avg. Reading Time"
        value={Math.round(avgSessionDuration)}
        unit="s"
        description="Time spent on article"
      />
      <MetricCard
        label="Completion Rate"
        value={Math.round(completionRate)}
        unit="%"
        description="Readers who reached 100%"
        tooltip="Percentage of readers who scrolled to the end of your article"
      />
      <MetricCard
        label="Avg. Scroll Depth"
        value={Math.round(avgScrollPercentage)}
        unit="%"
        description="Average scroll percentage"
        tooltip="Average percentage of the page readers scrolled through"
      />
    </div>
  );
}
