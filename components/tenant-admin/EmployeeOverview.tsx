"use client";

import "@/lib/chartjs-register";
import { useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Users, Loader2 } from "lucide-react";
import { ErrorNotice } from "@/components/ui";
import { getTenantAnalytics } from "@/lib/api/tenant-admin";
import { isAuthExpiredErrorMessage } from "@/lib/auth-session-events";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { useAppTheme } from "@/lib/use-app-theme";
import { tenantLegendLabels, tenantTooltipBase } from "@/lib/tenant-chart-tooltip";
import type { ChartData, ChartOptions } from "chart.js";

export function EmployeeOverview() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { theme } = useAppTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ totalUsers?: number; activeUsers?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTenantAnalytics()
      .then(setData)
      .catch((e) => {
        const message = e instanceof Error ? e.message : t.error;
        setError(isAuthExpiredErrorMessage(message) ? null : message);
      })
      .finally(() => setLoading(false));
  }, [t.error]);

  const total = data?.totalUsers ?? 0;
  const active = data?.activeUsers ?? 0;
  const rest = Math.max(0, total - active);

  const chartData = useMemo(
    () =>
      ({
        labels: [t.activeIn30Days, t.employeeChartRestLabel],
        datasets: [
          {
            data: [active, rest],
            backgroundColor: [isDark ? "#10b981" : "#059669", isDark ? "#3f3f46" : "#e4e4e7"],
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      }) as ChartData<"doughnut">,
    [active, isDark, rest, t.activeIn30Days, t.employeeChartRestLabel],
  );

  const chartOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "66%",
      animation: { animateRotate: true, duration: 900, easing: "easeOutQuart" },
      plugins: {
        legend: {
          position: "bottom",
          labels: tenantLegendLabels(isDark),
        },
        tooltip: {
          ...tenantTooltipBase(isDark),
          callbacks: {
            label(ctx) {
              const raw = ctx.dataset.data[ctx.dataIndex];
              const n = typeof raw === "number" ? raw : Number(raw);
              const label = ctx.label ? `${ctx.label}: ` : "";
              return ` ${label}${Number(n).toLocaleString()}`;
            },
          },
        },
      },
    }),
    [isDark],
  );

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-violet-50/20 to-zinc-50 p-8 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-violet-950/10 dark:to-zinc-900">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500/70" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/60 dark:bg-zinc-950">
        <div className="mb-2 flex items-center gap-2">
          <Users className="h-5 w-5 text-violet-500" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.employeeOverview}</h3>
        </div>
        <ErrorNotice message={error} className="mt-4" />
      </div>
    );
  }

  if (total <= 0) {
    return (
      <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-violet-50/20 to-zinc-50 p-8 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-violet-950/10 dark:to-zinc-900">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/20">
            <Users className="h-5 w-5 text-violet-600 dark:text-violet-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.employeeOverview}</h3>
        </div>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-violet-50/25 to-zinc-50/40 p-6 shadow-lg shadow-violet-100/30 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-violet-950/15 dark:to-zinc-900 dark:shadow-black/40 sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/20">
          <Users className="h-5 w-5 text-violet-600 dark:text-violet-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.employeeOverview}</h3>
      </div>
      <div className="flex flex-col items-stretch gap-6 sm:flex-row">
        <div className="mx-auto h-56 w-full max-w-[16rem] shrink-0 sm:mx-0">
          <Chart type="doughnut" data={chartData} options={chartOptions} />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4 rounded-2xl bg-white/60 p-5 text-sm dark:bg-zinc-900/50">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.totalUsersLabel}
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-900 dark:text-white">{total.toLocaleString()}</p>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-zinc-200/80 pt-4 dark:border-zinc-700/60">
            <span className="text-zinc-600 dark:text-zinc-400">{t.activeIn30Days}</span>
            <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {active.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-600 dark:text-zinc-400">{t.employeeChartRestLabel}</span>
            <span className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{rest.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
