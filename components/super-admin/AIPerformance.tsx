"use client";

import { Zap, CheckCircle, Activity, CalendarClock } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { useSuperAdminDashboardAnalytics } from "@/components/super-admin/SuperAdminDashboardAnalyticsContext";
import { formatCompactInt } from "@/components/super-admin/dashboard-chart-utils";

/**
 * Chỉ số LLM tổng hợp từ `llmUsage` (cùng nguồn với biểu đồ LLM).
 */
export function AIPerformance() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const { parsed, loading } = useSuperAdminDashboardAnalytics();
  const llm = parsed.llmUsage;

  const metrics = [
    {
      name: isEn ? "Avg tokens / request" : "Token TB / request",
      value: loading ? "—" : Math.round(llm.averageTokensPerRequest).toLocaleString(),
      status: "good" as const,
      icon: Zap,
      change: isEn ? "From analytics API" : "Từ API analytics",
    },
    {
      name: isEn ? "Total requests" : "Tổng request",
      value: loading ? "—" : llm.totalRequests.toLocaleString(),
      status: "good" as const,
      icon: CheckCircle,
      change: isEn ? "All-time" : "Toàn thời gian",
    },
    {
      name: isEn ? "Total tokens" : "Tổng token",
      value: loading ? "—" : formatCompactInt(llm.totalTokensUsed),
      status: "normal" as const,
      icon: Activity,
      change: isEn ? "All-time" : "Toàn thời gian",
    },
    {
      name: isEn ? "This month" : "Tháng này",
      value: loading
        ? "—"
        : `${formatCompactInt(llm.tokensThisMonth)} tok · ${llm.requestsThisMonth.toLocaleString()} req`,
      status: "normal" as const,
      icon: CalendarClock,
      change: isEn ? "Tokens & requests" : "Token & request",
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          {isEn ? "AI usage summary" : "Tóm tắt sử dụng AI"}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {isEn ? "Aggregated LLM metrics from the dashboard API" : "Chỉ số LLM gộp từ API dashboard"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-900">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        metric.status === "good" ? "bg-green-500/20" : "bg-blue-500/20"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          metric.status === "good"
                            ? "text-green-600 dark:text-green-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">{metric.value}</p>
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      metric.status === "good"
                        ? "text-green-600 dark:text-green-400"
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
