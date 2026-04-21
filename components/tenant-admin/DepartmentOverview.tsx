"use client";

import "@/lib/chartjs-register";
import { useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { Building2, Loader2 } from "lucide-react";
import { ErrorNotice } from "@/components/ui";
import { getTenantDepartments } from "@/lib/api/tenant-admin";
import { isAuthExpiredErrorMessage } from "@/lib/auth-session-events";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { useAppTheme } from "@/lib/use-app-theme";
import { barGradientBluePurpleHorizontal } from "@/lib/chart-gradients";
import { tenantLegendLabels, tenantTooltipBase } from "@/lib/tenant-chart-tooltip";
import type { ChartData, ChartOptions } from "chart.js";

function truncateLabel(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export function DepartmentOverview() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { theme } = useAppTheme();
  const isDark = theme === "dark";
  const [departments, setDepartments] = useState<{ id: number; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTenantDepartments()
      .then((list) =>
        setDepartments(
          list.map((d) => ({
            id: d.id,
            name: d.name ?? "—",
            count: d.employeeCount ?? 0,
          })),
        ),
      )
      .catch((e) => {
        const message = e instanceof Error ? e.message : t.error;
        setError(isAuthExpiredErrorMessage(message) ? null : message);
      })
      .finally(() => setLoading(false));
  }, [t.error]);

  const sorted = useMemo(
    () => [...departments].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    [departments],
  );

  const chartData = useMemo(
    () =>
      ({
        labels: sorted.map((d) => truncateLabel(d.name, 26)),
        datasets: [
          {
            label: t.departmentChartEmployeesAxis,
            data: sorted.map((d) => d.count),
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 22,
            borderWidth: 0,
            backgroundColor: (context: {
              chart: { ctx: CanvasRenderingContext2D; chartArea?: { left: number; right: number } };
            }) => {
              const { ctx, chartArea } = context.chart;
              if (!chartArea) return "#8b5cf6";
              return barGradientBluePurpleHorizontal(ctx, chartArea);
            },
          },
        ],
      }) as ChartData<"bar">,
    [sorted, t.departmentChartEmployeesAxis],
  );

  const chartHeight = useMemo(() => {
    const rows = Math.max(sorted.length, 1);
    return Math.min(420, 56 + rows * 36);
  }, [sorted.length]);

  const chartOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: "easeOutQuart" },
      layout: { padding: { top: 4, right: 12, bottom: 4, left: 4 } },
      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "end",
          labels: tenantLegendLabels(isDark),
        },
        tooltip: {
          ...tenantTooltipBase(isDark),
          callbacks: {
            title(items) {
              const i = items[0]?.dataIndex ?? 0;
              return sorted[i]?.name ?? "";
            },
            label(ctx) {
              const v = ctx.parsed.x;
              if (v == null || Number.isNaN(v)) return "";
              return ` ${ctx.dataset.label}: ${Number(v).toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          position: "bottom",
          grid: {
            color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
            drawTicks: false,
          },
          ticks: {
            color: isDark ? "#71717a" : "#a1a1aa",
            maxTicksLimit: 6,
            callback(value) {
              if (typeof value === "number") return value.toLocaleString();
              return value;
            },
          },
          border: { display: false },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: isDark ? "#a1a1aa" : "#52525b",
            font: { size: 11 },
            autoSkip: false,
          },
          border: { display: false },
        },
      },
    }),
    [isDark, sorted, t.departmentChartEmployeesAxis],
  );

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/20 p-8 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-indigo-950/10 dark:to-zinc-900">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500/70" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/60 dark:bg-zinc-950">
        <div className="mb-2 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.departmentOverview}</h3>
        </div>
        <ErrorNotice message={error} className="mt-4" />
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/20 p-8 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-indigo-950/10 dark:to-zinc-900">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15 ring-1 ring-indigo-500/20">
            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.departmentOverview}</h3>
        </div>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">{t.noDepartmentData}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-indigo-50/25 to-violet-50/20 p-6 shadow-lg shadow-indigo-100/30 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-indigo-950/10 dark:to-zinc-900 dark:shadow-black/40 sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15 ring-1 ring-indigo-500/20">
          <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{t.departmentOverview}</h3>
      </div>
      <div className="w-full" style={{ height: chartHeight }}>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
