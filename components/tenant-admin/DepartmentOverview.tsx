"use client";

import { useState, useEffect } from "react";
import { getTenantDepartments } from "@/lib/api/tenant-admin";
import { isAuthExpiredErrorMessage } from "@/lib/auth-session-events";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export function DepartmentOverview() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [departments, setDepartments] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTenantDepartments()
      .then((list) =>
        setDepartments(
          list.map((d) => ({ name: d.name ?? "—", count: d.employeeCount ?? 0 }))
        )
      )
      .catch((e) => {
        const message = e instanceof Error ? e.message : t.error;
        setError(isAuthExpiredErrorMessage(message) ? null : message);
      })
      .finally(() => setLoading(false));
  }, [t.error]);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.departmentOverview}</h3>
        <p className="mt-4 text-sm text-zinc-500">{t.loadingData}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.departmentOverview}</h3>
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{t.departmentOverview}</h3>
      <div className="mt-6 space-y-3">
        {departments.length === 0 ? (
          <p className="text-sm text-zinc-500">{t.noDepartmentData}</p>
        ) : (
          departments.map((dept) => (
            <div key={dept.name} className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{dept.name}</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{dept.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
