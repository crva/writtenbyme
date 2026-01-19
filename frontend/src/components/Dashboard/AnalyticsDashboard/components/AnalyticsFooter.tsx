function InsightMessage() {
  return (
    <p className="text-sm text-slate-600 dark:text-slate-400">
      <span className="font-medium">💡 Insight:</span> Writers who understand
      their readers write better. Use these metrics to see what resonates—long
      reads vs quick takes, geographic interests, and device preferences all
      tell a story about your audience.
    </p>
  );
}

export function AnalyticsFooter() {
  return (
    <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
      <InsightMessage />
    </div>
  );
}
