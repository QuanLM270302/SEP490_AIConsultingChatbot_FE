export function SubscriptionPlans() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Active Subscriptions</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Starter</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">8</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">organizations</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Standard</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">12</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">organizations</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Enterprise</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">4</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">organizations</p>
        </div>
      </div>
    </div>
  );
}
