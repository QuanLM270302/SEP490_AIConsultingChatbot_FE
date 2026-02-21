export function EmployeeOverview() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Employee Overview</h3>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Active</span>
          <span className="font-semibold text-zinc-900 dark:text-white">142</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">On Leave</span>
          <span className="font-semibold text-zinc-900 dark:text-white">8</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Pending Approval</span>
          <span className="font-semibold text-zinc-900 dark:text-white">6</span>
        </div>
      </div>
    </div>
  );
}
