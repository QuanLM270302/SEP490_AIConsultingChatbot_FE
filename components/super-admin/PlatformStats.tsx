import { Building2, Users, TrendingUp, Activity } from "lucide-react";

const stats = [
  {
    name: "Tổng Organizations",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: Building2,
  },
  {
    name: "Tổng Users",
    value: "1,234",
    change: "+18%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    name: "Active Sessions",
    value: "892",
    change: "+8%",
    changeType: "positive" as const,
    icon: Activity,
  },
  {
    name: "System Uptime",
    value: "99.9%",
    change: "+0.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

export function PlatformStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="rounded-3xl bg-white p-5 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">
                {stat.name}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400">
                {stat.change}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10">
              <stat.icon className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
