import { MetricCard } from "./MetricCard";

interface MetricsGridProps {
  totalViews: number;
  avgSessionDuration: number;
  completionRate: number;
}

export function MetricsGrid({
  totalViews,
  avgSessionDuration,
  completionRate,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        description="Readers who reached the end"
        tooltip="Percentage of readers who scrolled to the end of your article"
      />
    </div>
  );
}
