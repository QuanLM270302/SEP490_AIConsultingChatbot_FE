"use client";

import "@/lib/chartjs-register";
import { useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";
import { BarChart3, Loader2, TrendingUp } from "lucide-react";
import { getTenantDashboard, getTenantDepartments, getTenantRoles } from "@/lib/api/tenant-admin";
import { isAuthExpiredErrorMessage } from "@/lib/auth-session-events";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { useAppTheme } from "@/lib/use-app-theme";
import { barGradientEmerald } from "@/lib/chart-gradients";
import { tenantLegendLabels, tenantTooltipBase } from "@/lib/tenant-chart-tooltip";
import type { ChartData, ChartOptions } from "chart.js";
import { ErrorNotice } from "@/components/ui";

export function OrganizationStats() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { theme } = useAppTheme();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [departmentCount, setDepartmentCount] = useState<number | null>(null);
  const [roleCount, setRoleCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
    });

    Promise.all([getTenantDashboard(), getTenantDepartments(), getTenantRoles()])
      .then(([dashboard, departments, roles]) => {
        if (cancelled) return;
        setTotalUsers(dashboard.totalUsers ?? null);
        setDepartmentCount(departments?.length ?? null);
        setRoleCount(roles?.length ?? null);
      })
      .catch((e) => {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : t.errorLoadingData;
        setError(isAuthExpiredErrorMessage(message) ? null : message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [t.errorLoadingData]);

  const emp = totalUsers ?? 0;
  const dept = departmentCount ?? 0;
  const roles = roleCount ?? 0;

  const chartData = useMemo(
    () =>
      ({
        labels: [t.totalEmployees, t.departments, t.activeRoles],
        datasets: [
          {
            label: t.dashboardOrgBarSeries,
            data: [emp, dept, roles],
            borderRadius: 10,
            borderSkipped: false,
            maxBarThickness: 72,
            borderWidth: 0,
            backgroundColor: (context: {
              chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } };
            }) => {
              const { ctx, chartArea } = context.chart;
              if (!chartArea) return "#10b981";
              return barGradientEmerald(ctx, chartArea);
            },
          },
        ],
      }) as ChartData<"bar">,
    [dept, emp, roles, t.activeRoles, t.dashboardOrgBarSeries, t.departments, t.totalEmployees],
  );

  const chartOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800, easing: "easeOutQuart" },
      layout: { padding: { top: 4, right: 8, bottom: 4, left: 4 } },
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
            label(ctx) {
              const v = ctx.parsed.y;
              if (v == null || Number.isNaN(v)) return "";
              return ` ${ctx.dataset.label}: ${Number(v).toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isDark ? "#a1a1aa" : "#52525b",
            font: { size: 11, weight: 500 },
            maxRotation: 0,
          },
          border: { display: false },
        },
        y: {
          beginAtZero: true,
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
      },
    }),
    [isDark, t.dashboardOrgBarSeries],
  );

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 p-8 shadow-lg shadow-emerald-100/40 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-emerald-950/10 dark:to-zinc-900 dark:shadow-black/40">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500/80" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800/60 dark:bg-zinc-950">
        <ErrorNotice message={error} />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-emerald-50/25 to-teal-50/15 p-6 shadow-lg shadow-emerald-100/35 sm:p-8 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-emerald-950/10 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20">
            <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t.statistics}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.manageEmployeesStructure}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-zinc-500/10 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            {t.growthRate}: —
          </span>
        </div>
      </div>
      <div className="h-[min(16rem,40vw)] w-full min-h-[200px] sm:h-64">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
