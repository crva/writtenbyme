import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  description?: string;
  tooltip?: string;
}

export function MetricCard({
  label,
  value,
  unit = "",
  description,
  tooltip,
}: MetricCardProps) {
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
