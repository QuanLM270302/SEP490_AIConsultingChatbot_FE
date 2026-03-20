"use client";

import { useState, useEffect } from "react";
import { getTenantAnalytics } from "@/lib/api/tenant-admin";

export function EmployeeOverview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ totalUsers?: number; activeUsers?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTenantAnalytics()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Employee Overview</h3>
        <p className="mt-4 text-sm text-zinc-500">Đang tải…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Employee Overview</h3>
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Employee Overview</h3>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Total users</span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {data?.totalUsers != null ? data.totalUsers : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Active (30 ngày)</span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            {data?.activeUsers != null ? data.activeUsers : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
