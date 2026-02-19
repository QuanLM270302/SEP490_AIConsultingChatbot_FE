import { Cpu, HardDrive, Activity, Database } from "lucide-react";

const metrics = [
  { name: "CPU Usage", value: "45%", icon: Cpu, status: "good" },
  { name: "Memory", value: "62%", icon: HardDrive, status: "good" },
  { name: "API Response", value: "120ms", icon: Activity, status: "good" },
  { name: "Database Load", value: "78%", icon: Database, status: "warning" },
];

export function SystemMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.name} className="rounded-3xl bg-white p-5 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10">
              <metric.icon className="h-5 w-5 text-green-500" />
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              metric.status === "good" 
                ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}>
              {metric.status === "good" ? "GOOD" : "WARNING"}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{metric.value}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{metric.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
