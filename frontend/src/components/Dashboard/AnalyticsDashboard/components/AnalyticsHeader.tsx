import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsHeaderProps {
  title: string;
  timeRange: "24h" | "7d" | "30d" | "all";
  onTimeRangeChange: (range: "24h" | "7d" | "30d" | "all") => void;
}

export function AnalyticsHeader({
  title,
  timeRange,
  onTimeRangeChange,
}: AnalyticsHeaderProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">{title}</h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            How readers engaged with this article
          </p>
        </div>
        <Tabs
          value={timeRange}
          onValueChange={(value) =>
            onTimeRangeChange(value as "24h" | "7d" | "30d" | "all")
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
  );
}
