"use client";

import { Zap, CheckCircle, AlertTriangle, Activity } from "lucide-react";

const metrics = [
  { name: "Avg Response Time", value: "—", status: "good" as const, icon: Zap, change: "—" },
  { name: "AI Success Rate", value: "—", status: "good" as const, icon: CheckCircle, change: "—" },
  { name: "Low Confidence", value: "—", status: "warning" as const, icon: AlertTriangle, change: "—" },
  { name: "Token Usage", value: "—", status: "normal" as const, icon: Activity, change: "—" },
];

export function AIPerformance() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          AI Performance
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Hiệu suất AI chatbot platform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.name}
              className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        metric.status === "good"
                          ? "bg-green-500/20"
                          : metric.status === "warning"
                          ? "bg-amber-500/20"
                          : "bg-blue-500/20"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          metric.status === "good"
                            ? "text-green-600 dark:text-green-400"
                            : metric.status === "warning"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                    {metric.value}
                  </p>
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      metric.status === "good"
                        ? "text-green-600 dark:text-green-400"
                        : metric.status === "warning"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {metric.change}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
