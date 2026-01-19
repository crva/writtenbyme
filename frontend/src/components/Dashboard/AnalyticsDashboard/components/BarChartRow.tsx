interface BarChartRowProps {
  label: string;
  count: number;
  percentage: number;
  maxCount: number;
}

export function BarChartRow({
  label,
  count,
  percentage,
  maxCount,
}: BarChartRowProps) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-24 shrink-0">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
          {label}
        </p>
      </div>
      <div className="flex-1">
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${(count / maxCount) * 100}%` }}
          />
        </div>
      </div>
      <div className="w-16 shrink-0 text-right">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {percentage}%
        </p>
      </div>
    </div>
  );
}
