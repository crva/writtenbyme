import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChartRow } from "./BarChartRow";

interface OSData {
  os: string;
  count: number;
}

interface BrowserData {
  browser: string;
  count: number;
}

interface DeviceBreakdownProps {
  operatingSystems: OSData[];
  browsers: BrowserData[];
  totalViews: number;
}

export function DeviceBreakdown({
  operatingSystems,
  browsers,
  totalViews,
}: DeviceBreakdownProps) {
  const osMax = Math.max(...operatingSystems.map((o) => o.count), 1);
  const browserMax = Math.max(...browsers.map((b) => b.count), 1);

  return (
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
  );
}
