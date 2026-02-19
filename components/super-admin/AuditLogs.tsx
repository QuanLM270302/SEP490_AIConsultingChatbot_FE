export function AuditLogs() {
  const logs = [
    { time: "2024-03-15 10:30", user: "admin@system.com", action: "Updated compliance policy", status: "success" },
    { time: "2024-03-15 09:15", user: "admin@system.com", action: "Approved organization onboarding", status: "success" },
    { time: "2024-03-15 08:45", user: "system", action: "Automated backup completed", status: "success" },
  ];

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Audit Logs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Time</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">User</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Action</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {logs.map((log, idx) => (
              <tr key={idx} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="px-6 py-4 text-xs text-zinc-900 dark:text-white">{log.time}</td>
                <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">{log.user}</td>
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">{log.action}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
