"use client";

import { PieChart, Users } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { useSuperAdminDashboardAnalytics } from "@/components/super-admin/SuperAdminDashboardAnalyticsContext";

type TenantStatusBreakdownProps = {
  title: string;
  subtitle: string;
  header: "users" | "pie";
};

/**
 * Hai card tenant (status / mix) — cùng layout: tổng, 4 thanh %, footer 4 ô + tóm tắt đã duyệt.
 */
export function TenantStatusBreakdown({ title, subtitle, header }: TenantStatusBreakdownProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const { parsed, loading } = useSuperAdminDashboardAnalytics();
  const { active, pending, suspended, rejected } = parsed.tenants;

  const raw = [
    { key: "active", name: isEn ? "Active" : "Hoạt động", count: active, color: "bg-emerald-500" },
    { key: "pending", name: isEn ? "Pending" : "Chờ duyệt", count: pending, color: "bg-amber-500" },
    { key: "suspended", name: isEn ? "Suspended" : "Tạm ngưng", count: suspended, color: "bg-zinc-500" },
    { key: "rejected", name: isEn ? "Rejected" : "Từ chối", count: rejected, color: "bg-red-500" },
  ];

  const sum = raw.reduce((s, x) => s + x.count, 0);
  const rows = raw.map((x) => ({
    ...x,
    percentage: sum > 0 ? Math.round((x.count / sum) * 1000) / 10 : 0,
  }));

  const HeaderIcon = header === "users" ? Users : PieChart;
  const iconWrap =
    header === "users"
      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
      : "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:ring-zinc-800 dark:shadow-black/40">
      <div className="mb-8 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconWrap}`}>
          <HeaderIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">{subtitle}</p>
        </div>
      </div>

      <div className="mb-6 text-center">
        <p className="text-5xl font-bold tabular-nums text-zinc-900 dark:text-white">
          {loading ? "—" : sum.toLocaleString()}
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {isEn ? "Total tenants" : "Tổng tổ chức"}
        </p>
      </div>

      <div className="space-y-5">
        {rows.map((plan) => (
          <div key={plan.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${plan.color}`} />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{plan.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-white">
                  {loading ? "—" : plan.count.toLocaleString()}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  ({loading ? "—" : `${plan.percentage}%`})
                </span>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  plan.color === "bg-amber-500"
                    ? "bg-gradient-to-r from-amber-400 to-amber-600"
                    : plan.color === "bg-emerald-500"
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                      : plan.color === "bg-red-500"
                        ? "bg-gradient-to-r from-red-400 to-red-600"
                        : "bg-gradient-to-r from-zinc-400 to-zinc-600"
                }`}
                style={{ width: `${loading ? 0 : Math.min(plan.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-zinc-100/95 p-4 ring-1 ring-zinc-200/80 sm:grid-cols-4 dark:bg-zinc-900">
        {rows.map((plan) => (
          <div key={plan.key} className="text-center">
            <div className={`mx-auto mb-1 h-2 w-2 rounded-full ${plan.color}`} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{plan.name}</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-white">
              {loading ? "—" : plan.count.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-100/95 p-4 text-center ring-1 ring-zinc-200/80 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {isEn ? "Approved total (API)" : "Đã duyệt (API)"}
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {loading ? "—" : parsed.tenants.total.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
