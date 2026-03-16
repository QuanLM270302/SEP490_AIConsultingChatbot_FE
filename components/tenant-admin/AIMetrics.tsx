"use client";

import { Zap, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const metrics = [
  {
    name: "Total Queries",
    value: "24,680",
    subtitle: "This month",
    icon: Zap,
    color: "blue",
  },
  {
    name: "Success Rate",
    value: "96.8%",
    subtitle: "+1.2% from last month",
    icon: CheckCircle,
    color: "green",
  },
  {
    name: "Avg Response Time",
    value: "1.8s",
    subtitle: "-0.2s improvement",
    icon: Clock,
    color: "purple",
  },
  {
    name: "Low Confidence",
    value: "3.2%",
    subtitle: "124 responses",
    icon: AlertTriangle,
    color: "amber",
  },
];

export function AIMetrics() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.name}
            className="rounded-3xl bg-white p-5 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-400">
                  {metric.name}
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {metric.subtitle}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                metric.color === "blue" ? "bg-blue-500/10" :
                metric.color === "green" ? "bg-green-500/10" :
                metric.color === "purple" ? "bg-purple-500/10" :
                "bg-amber-500/10"
              }`}>
                <Icon className={`h-5 w-5 ${
                  metric.color === "blue" ? "text-blue-500" :
                  metric.color === "green" ? "text-green-500" :
                  metric.color === "purple" ? "text-purple-500" :
                  "text-amber-500"
                }`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
