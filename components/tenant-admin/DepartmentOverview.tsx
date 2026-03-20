"use client";

import { useState, useEffect } from "react";
import { getTenantDepartments } from "@/lib/api/tenant-admin";

export function DepartmentOverview() {
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
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Department Overview</h3>
        <p className="mt-4 text-sm text-zinc-500">Đang tải…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Department Overview</h3>
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Department Overview</h3>
      <div className="mt-6 space-y-3">
        {departments.length === 0 ? (
          <p className="text-sm text-zinc-500">Chưa có dữ liệu phòng ban.</p>
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
