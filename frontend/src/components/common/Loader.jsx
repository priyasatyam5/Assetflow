export function StatCardSkeleton() {
  return (
    <div className="h-28 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mt-6 h-8 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-3 w-1/5 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="h-72 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}
