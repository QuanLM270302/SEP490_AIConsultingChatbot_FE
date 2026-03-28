"use client";

import { MessageSquare } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { useSuperAdminDashboardAnalytics } from "@/components/super-admin/SuperAdminDashboardAnalyticsContext";
import { formatCompactInt } from "@/components/super-admin/dashboard-chart-utils";

/**
 * LLM usage snapshot: all-time vs this month (requests & tokens) — dữ liệu từ `llmUsage` analytics.
 */
export function AIQueriesChart() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const { parsed, loading } = useSuperAdminDashboardAnalytics();
  const llm = parsed.llmUsage;

  const rows = [
    {
      key: "tr",
      label: isEn ? "Total requests" : "Tổng request",
      value: llm.totalRequests,
    },
    {
      key: "rm",
      label: isEn ? "Requests (this month)" : "Request tháng này",
      value: llm.requestsThisMonth,
    },
    {
      key: "tt",
      label: isEn ? "Total tokens" : "Tổng token",
      value: llm.totalTokensUsed,
    },
    {
      key: "tm",
      label: isEn ? "Tokens (this month)" : "Token tháng này",
      value: llm.tokensThisMonth,
    },
  ];

  const maxValue = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 p-8 shadow-lg shadow-green-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/20">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {isEn ? "LLM usage" : "Sử dụng LLM"}
            </h3>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            {isEn ? "Requests and tokens (all-time vs this month)" : "Request và token (tổng vs tháng hiện tại)"}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {rows.map((data, index) => {
          const percentage = loading ? 0 : (data.value / maxValue) * 100;
          return (
            <div key={data.key} className="group space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {data.label}
                </span>
                <span className="text-base font-bold text-zinc-900 dark:text-white tabular-nums">
                  {loading ? "—" : formatCompactInt(data.value)}
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/85 ring-1 ring-emerald-100/70 dark:bg-zinc-800/60 dark:ring-0">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 shadow-lg shadow-green-500/30 transition-all duration-700 ease-out group-hover:shadow-green-500/50"
                  style={{
                    width: `${Math.max(percentage, data.value > 0 ? 4 : 0)}%`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 rounded-2xl bg-white/95 p-5 ring-1 ring-emerald-200/70 dark:bg-zinc-800/40 dark:ring-0">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {isEn ? "Avg tokens / request" : "Token TB / request"}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {loading
              ? "—"
              : Math.round(llm.averageTokensPerRequest).toLocaleString()}
          </p>
        </div>
        <div className="border-x border-zinc-200 text-center dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {isEn ? "Total requests" : "Tổng request"}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {loading ? "—" : llm.totalRequests.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {isEn ? "Total tokens" : "Tổng token"}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {loading ? "—" : formatCompactInt(llm.totalTokensUsed)}
          </p>
        </div>
      </div>
    </div>
  );
}
