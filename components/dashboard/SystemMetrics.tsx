import { Cpu, HardDrive, Activity, Database } from "lucide-react";

const metrics = [
  { name: "CPU Usage", value: "45%", icon: Cpu, status: "good" },
  { name: "Memory", value: "62%", icon: HardDrive, status: "good" },
  { name: "API Response Time", value: "120ms", icon: Activity, status: "good" },
  { name: "Database Load", value: "78%", icon: Database, status: "warning" },
];

export function SystemMetrics() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <metric.icon className="h-8 w-8 text-blue-500" />
            <span
              className={`text-xs font-semibold ${
                metric.status === "good" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {metric.status === "good" ? "GOOD" : "WARNING"}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              {metric.value}
            </p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {metric.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
