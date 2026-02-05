export function StatisticsCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          User Growth
        </h3>
        <div className="mt-6 flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">
            Chart placeholder - Line chart
          </p>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Usage by Organization
        </h3>
        <div className="mt-6 flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">
            Chart placeholder - Bar chart
          </p>
        </div>
      </div>
    </div>
  );
}
