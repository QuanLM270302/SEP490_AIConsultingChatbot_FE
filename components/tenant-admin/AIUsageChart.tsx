"use client";

import { MessageSquare, TrendingUp, Loader2 } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import type { TenantLlmUsageResponse } from "@/lib/api/tenant-admin";

export function AIUsageChart({
  data,
  loading,
  error,
}: {
  data: TenantLlmUsageResponse | null;
  loading: boolean;
  error: string | null;
}) {
  const { language } = useLanguageStore();
  const t = translations[language];

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:from-zinc-950 dark:to-zinc-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500/70" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    );
  }

  const today = data?.requestsToday ?? 0;
  const month = data?.requestsThisMonth ?? 0;
  const total = data?.totalRequests ?? 0;

  const usageData = [
    { day: t.chartToday, queries: today },
    { day: t.chartThisMonth, queries: month },
    { day: t.chartAllTime, queries: total },
  ];

  const maxValue = Math.max(...usageData.map((d) => d.queries), 1);
  const peakRequests = Math.max(today, month, total);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg shadow-blue-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t.llmRequestVolumeTitle}</h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.llmRequestVolumeHint}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-blue-500/20 px-4 py-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {peakRequests.toLocaleString()} · {t.peak}
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between gap-2">
        {usageData.map((row, index) => {
          const heightPercentage = (row.queries / maxValue) * 100;
          return (
            <div key={row.day} className="group flex flex-1 flex-col items-center gap-3">
              <div className="relative w-full">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-700 ease-out group-hover:shadow-blue-500/50"
                  style={{
                    height: `${Math.max(heightPercentage * 1.2, 24)}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                    {row.queries.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-center text-xs font-semibold text-zinc-700 dark:text-zinc-300">{row.day}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 rounded-2xl bg-white/60 p-5 dark:bg-zinc-800/40">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {t.totalAiRequestsLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{total.toLocaleString()}</p>
        </div>
        <div className="border-x border-zinc-200 text-center dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {t.tokensThisMonthLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {(data?.tokensThisMonth ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {t.totalTokensUsedLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {(data?.totalTokensUsed ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
