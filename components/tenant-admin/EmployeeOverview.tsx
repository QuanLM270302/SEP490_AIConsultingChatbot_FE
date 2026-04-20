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
import { tenantTooltipBase } from "@/lib/tenant-chart-tooltip";
import type { ArcElement, ChartData, ChartOptions, Plugin } from "chart.js";

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
            borderColor: [isDark ? "#10b981" : "#059669", isDark ? "#3f3f46" : "#e4e4e7"],
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      }) as ChartData<"doughnut">,
    [active, isDark, rest, t.activeIn30Days, t.employeeChartRestLabel],
  );

  const pctActive = total > 0 ? Math.round((active / total) * 100) : 0;
  const pctRest = total > 0 ? Math.max(0, 100 - pctActive) : 0;

  const percentageLabelPlugin = useMemo<Plugin<"doughnut">>(
    () => ({
      id: "employee-overview-percent-labels",
      afterDatasetsDraw(chart) {
        const dataset = chart.data.datasets[0];
        if (!dataset) return;

        const values = (dataset.data as Array<number | string>).map((value) => Number(value));
        const totalValue = values.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
        if (totalValue <= 0) return;

        const meta = chart.getDatasetMeta(0);
        const { ctx } = chart;

        const drawRoundedRect = (
          x: number,
          y: number,
          width: number,
          height: number,
          radius: number,
        ) => {
          const r = Math.min(radius, width / 2, height / 2);
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + width - r, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + r);
          ctx.lineTo(x + width, y + height - r);
          ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
          ctx.lineTo(x + r, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
        };

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "700 12px Geist, Inter, Segoe UI, Roboto, sans-serif";

        meta.data.forEach((element, index) => {
          const value = values[index] ?? 0;
          if (!Number.isFinite(value) || value <= 0) return;

          const arc = element as ArcElement;
          const { x, y, startAngle, endAngle, innerRadius, outerRadius } = arc.getProps(
            ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"],
            true,
          );
          if (x == null || y == null) return;
          const angle = (startAngle + endAngle) / 2;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const textX = x + Math.cos(angle) * radius;
          const textY = y + Math.sin(angle) * radius;
          const pct = index === 0 ? pctActive : pctRest;
          if (pct <= 0) return;
          const label = `${pct}%`;

          const metrics = ctx.measureText(label);
          const badgePaddingX = 8;
          const badgeHeight = 22;
          const badgeWidth = Math.ceil(metrics.width + badgePaddingX * 2);
          const badgeX = textX - badgeWidth / 2;
          const badgeY = textY - badgeHeight / 2;

          const strokeColor =
            index === 0
              ? isDark
                ? "rgba(16,185,129,0.62)"
                : "rgba(5,150,105,0.38)"
              : isDark
                ? "rgba(212,212,216,0.42)"
                : "rgba(63,63,70,0.22)";

          ctx.shadowColor = isDark ? "rgba(0,0,0,0.5)" : "rgba(15,23,42,0.2)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 2;
          ctx.fillStyle = isDark ? "rgba(24,24,27,0.94)" : "rgba(255,255,255,0.96)";
          drawRoundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
          ctx.fill();

          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.2;
          drawRoundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
          ctx.stroke();

          ctx.fillStyle =
            index === 0
              ? isDark
                ? "#d1fae5"
                : "#065f46"
              : isDark
                ? "#e4e4e7"
                : "#3f3f46";
          ctx.fillText(label, textX, textY + 0.5);
        });

        ctx.restore();
      },
    }),
    [isDark, pctActive, pctRest],
  );

  const chartOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "66%",
      interaction: { mode: "nearest", intersect: true },
      animation: { animateRotate: true, duration: 900, easing: "easeOutQuart" },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: "transparent",
          hoverBorderColor: "rgba(255,255,255,0.35)",
          hoverBorderWidth: 2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          ...tenantTooltipBase(isDark),
          enabled: true,
          position: "nearest",
          callbacks: {
            title(items) {
              const first = items[0];
              return first?.label ? String(first.label) : "";
            },
            label(ctx) {
              const raw = ctx.dataset.data[ctx.dataIndex];
              const n = typeof raw === "number" ? raw : Number(raw);
              const label = ctx.label ? `${ctx.label}: ` : "";
              const arr = ctx.dataset.data as number[];
              const sum = arr.reduce((a, b) => a + Number(b), 0);
              const idx = ctx.dataIndex;
              const pctFirst = sum > 0 ? Math.round((Number(arr[0]) / sum) * 100) : 0;
              const pct = sum <= 0 ? 0 : idx === 0 ? pctFirst : Math.max(0, 100 - pctFirst);
              return ` ${label}${Number(n).toLocaleString()} (${pct}%)`;
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
          <Chart type="doughnut" data={chartData} options={chartOptions} plugins={[percentageLabelPlugin]} />
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
            <span className="text-right font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              <span className="block">{active.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-600 dark:text-zinc-400">{t.employeeChartRestLabel}</span>
            <span className="text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
              <span className="block">{rest.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
