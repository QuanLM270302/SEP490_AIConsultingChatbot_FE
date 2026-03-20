export function OnboardingStats() {
  const stats = [
    { label: "Chờ duyệt", value: "—", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-500/10" },
    { label: "Đã duyệt tháng này", value: "—", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-500/10" },
    { label: "Từ chối", value: "—", color: "text-rose-600 dark:text-rose-400", bgColor: "bg-rose-500/10" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
          <p className="text-xs font-medium text-zinc-400">{stat.label}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bgColor}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
