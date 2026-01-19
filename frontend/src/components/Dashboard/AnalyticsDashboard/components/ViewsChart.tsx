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
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Readers",
    color: "#7c3aed",
  },
} satisfies ChartConfig;

interface ViewsChartProps {
  data: Array<{ day: string; views: number }>;
  timeRange: "24h" | "7d" | "30d" | "all";
}

export function ViewsChart({ data, timeRange }: ViewsChartProps) {
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "24h":
        return "24 hours";
      case "7d":
        return "7 days";
      case "30d":
        return "30 days";
      default:
        return "all time";
    }
  };

  return (
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
              data={data}
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
          Showing data for the last {getTimeRangeLabel()}
        </p>
      </CardContent>
    </Card>
  );
}
