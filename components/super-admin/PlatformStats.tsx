"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { getStoredUser } from "@/lib/auth-store";
import { useSuperAdminDashboardAnalytics } from "@/components/super-admin/SuperAdminDashboardAnalyticsContext";

/**
 * Chỉ KPI không lặp lại trong biểu đồ bên dưới: tài khoản nền tảng (platform users).
 * Tenant / LLM / subscription / documents đã có trong các chart.
 */
export function PlatformStats() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { parsed, loading, error } = useSuperAdminDashboardAnalytics();
  const [mounted, setMounted] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const roles = getStoredUser()?.roles ?? [];
    setIsSuperAdmin(roles.some((role) => role.includes("SUPER_ADMIN")));
    setMounted(true);
  }, []);

  if (!mounted || !isSuperAdmin) return null;

  const format = (n: number) =>
    loading ? "—" : Number.isFinite(n) ? n.toLocaleString() : "—";

  return (
    <div className="space-y-4">
      {!loading && error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{t.errorLoadingData}</p>
      ) : null}

      <div className="grid gap-4 sm:max-w-md">
        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-400" title={t.platformTotalUsers}>
                {t.platformTotalUsers}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {format(parsed.adminPlatformUsers)}
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {language === "en"
                  ? "Staff & Super Admin active accounts (dashboard API)."
                  : "Tài khoản Staff & Super Admin đang active (API dashboard)."}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
