export function UsageStatistics() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Total API Calls</p>
        <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">1.2M</p>
        <p className="mt-1 text-sm text-green-600">+15% from last month</p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Storage Used</p>
        <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">450 GB</p>
        <p className="mt-1 text-sm text-green-600">+8% from last month</p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Active Users</p>
        <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">892</p>
        <p className="mt-1 text-sm text-green-600">+12% from last month</p>
      </div>
    </div>
  );
}
