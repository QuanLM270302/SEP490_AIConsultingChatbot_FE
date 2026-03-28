"use client";

import { Zap, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

type MetricNameKey =
  | "aiMetricAvgResponse"
  | "aiMetricSuccessRate"
  | "aiMetricLowConfidence"
  | "aiMetricTokenUsage";

const metrics: Array<{
  nameKey: MetricNameKey;
  value: string;
  status: "good" | "warning" | "normal";
  icon: typeof Zap;
  change: string;
}> = [
  { nameKey: "aiMetricAvgResponse", value: "—", status: "good", icon: Zap, change: "—" },
  { nameKey: "aiMetricSuccessRate", value: "—", status: "good", icon: CheckCircle, change: "—" },
  { nameKey: "aiMetricLowConfidence", value: "—", status: "warning", icon: AlertTriangle, change: "—" },
  { nameKey: "aiMetricTokenUsage", value: "—", status: "normal", icon: Activity, change: "—" },
];

export function AIPerformance() {
  const { language } = useLanguageStore();
  const t = translations[language];
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          {t.aiPerformancePanelTitle}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t.aiPerformancePanelSubtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.nameKey}
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
                    {t[metric.nameKey]}
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
