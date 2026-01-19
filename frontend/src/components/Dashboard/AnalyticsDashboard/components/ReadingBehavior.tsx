import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DistributionBar } from "./DistributionBar";

interface ReadingBehaviorProps {
  readingTimeDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
}

export function ReadingBehavior({
  readingTimeDistribution,
}: ReadingBehaviorProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Reading Behavior</CardTitle>
        <CardDescription>How readers spent their time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">
            Reading Time Distribution
          </h4>
          <div className="space-y-3">
            {readingTimeDistribution
              .filter((item) => item.count > 0)
              .map((item) => (
                <DistributionBar
                  key={item.range}
                  label={item.range}
                  percentage={item.percentage}
                />
              ))}
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            This shows how many readers spent different amounts of time on your
            article, helping you understand whether readers are skimming or
            diving deep.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
