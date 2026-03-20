import { Building2, Users, MessageSquare, CheckCircle, XCircle, FileText } from "lucide-react";

const stats = [
  { name: "Total Tenants", value: "—", icon: Building2 },
  { name: "Active Tenants", value: "—", icon: CheckCircle },
  { name: "Suspended Tenants", value: "—", icon: XCircle },
  { name: "Total Users", value: "—", icon: Users },
  { name: "Total Documents", value: "—", icon: FileText },
  { name: "Total AI Queries", value: "—", icon: MessageSquare },
];

export function PlatformStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
