"use client";

import { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import {
  Building2,
  FileText,
  CreditCard,
  ClipboardCheck,
  PauseCircle,
  PlayCircle,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  type StaffDashboardStats,
} from "@/lib/api/staff";
import {
  fetchPlatformDashboard,
  parsePlatformDashboardJson,
} from "@/lib/api/platform-dashboard";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export default function StaffDashboardPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [stats, setStats] = useState<StaffDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = () => {
    setStatsLoading(true);
    setError(null);
    void fetchPlatformDashboard(true)
      .then(({ ok, data }) => {
        if (!ok) throw new Error("Không tải được thống kê dashboard");
        const parsed = parsePlatformDashboardJson(true, data);
        const totalUsersRaw = data.totalUsers;
        const totalUsers =
          typeof totalUsersRaw === "number" && Number.isFinite(totalUsersRaw)
            ? totalUsersRaw
            : parsed.tenants.active;
        setStats({
          tenants: {
            total: parsed.tenants.total,
            active: parsed.tenants.active,
            pending: parsed.tenants.pending,
            suspended: parsed.tenants.suspended,
            ...(parsed.tenants.activePercentage > 0
              ? { activePercentage: parsed.tenants.activePercentage }
              : {}),
          },
          totalUsers,
          subscriptions: { total: parsed.staffSubscriptionsTotal },
          totalDocuments: parsed.staffTotalDocuments,
        });
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Lỗi tải thống kê");
        setStats(null);
      })
      .finally(() => setStatsLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <StaffLayout>
      <div className="space-y-10">
        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-500/30 dark:shadow-emerald-900/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t.staffDashboard}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-emerald-50/90">
              {t.staffDescription}
            </p>
          </div>
        </section>

        {/* Statistics */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500" />
            {t.statistics}
          </h2>
          {statsLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              <span className="text-sm text-zinc-500">{t.loading}…</span>
            </div>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Building2}
                label={t.totalTenants}
                value={stats.tenants.total}
              />
              <StatCard
                icon={ClipboardCheck}
                label={t.pending}
                value={stats.tenants.pending}
                accent="amber"
              />
              <StatCard
                icon={PlayCircle}
                label={t.active}
                value={stats.tenants.active}
                accent="emerald"
              />
              <StatCard
                icon={PauseCircle}
                label={t.suspended}
                value={stats.tenants.suspended}
                accent="zinc"
              />
              <StatCard
                icon={CreditCard}
                label={t.totalSubscriptions}
                value={stats.subscriptions.total}
              />
              <StatCard
                icon={FileText}
                label={t.totalDocuments}
                value={stats.totalDocuments}
              />
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
              {error || t.noData}
            </div>
          )}
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}
      </div>
    </StaffLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = "emerald",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: "emerald" | "amber" | "zinc";
}) {
  const bg =
    accent === "amber"
      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : accent === "zinc"
        ? "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  return (
    <div className="rounded-3xl bg-white p-5 shadow-lg shadow-emerald-500/5 ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:ring-zinc-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
