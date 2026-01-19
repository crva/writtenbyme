import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChartRow } from "./BarChartRow";

interface CountryData {
  country: string;
  count: number;
}

interface GeographyBreakdownProps {
  countries: CountryData[];
  totalViews: number;
}

export function GeographyBreakdown({
  countries,
  totalViews,
}: GeographyBreakdownProps) {
  if (countries.length === 0) return null;

  const countryMax = Math.max(...countries.map((c) => c.count), 1);

  return (
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
  );
}
