"use client";

import { useState, useEffect } from "react";
import { getTenantAnalytics } from "@/lib/api/tenant-admin";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export function EmployeeOverview() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ totalUsers?: number; activeUsers?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTenantAnalytics()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : t.error))
      .finally(() => setLoading(false));
  }, [t.error]);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.employeeOverview}</h3>
        <p className="mt-4 text-sm text-zinc-500">{t.loadingData}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.employeeOverview}</h3>
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.employeeOverview}</h3>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.totalUsersLabel}</span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {data?.totalUsers != null ? data.totalUsers : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{t.activeIn30Days}</span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {data?.activeUsers != null ? data.activeUsers : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
