"use client";

import { useState, useEffect } from "react";
import { Users, Building, Shield, TrendingUp } from "lucide-react";
import { getTenantDashboard, getTenantDepartments, getTenantRoles } from "@/lib/api/tenant-admin";

const statConfig = [
  { key: "employees" as const, name: "Total Employees", icon: Users },
  { key: "departments" as const, name: "Departments", icon: Building },
  { key: "roles" as const, name: "Active Roles", icon: Shield },
  { key: "growth" as const, name: "Growth Rate", icon: TrendingUp },
];

export function OrganizationStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [departmentCount, setDepartmentCount] = useState<number | null>(null);
  const [roleCount, setRoleCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      getTenantDashboard(),
      getTenantDepartments(),
      getTenantRoles(),
    ])
      .then(([dashboard, departments, roles]) => {
        if (cancelled) return;
        setTotalUsers(dashboard.totalUsers ?? null);
        setDepartmentCount(departments?.length ?? null);
        setRoleCount(roles?.length ?? null);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const display = (key: string) => {
    if (loading) return "…";
    if (error) return "—";
    switch (key) {
      case "employees":
        return totalUsers != null ? String(totalUsers) : "—";
      case "departments":
        return departmentCount != null ? String(departmentCount) : "—";
      case "roles":
        return roleCount != null ? String(roleCount) : "—";
      case "growth":
        return "—";
      default:
        return "—";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statConfig.map(({ key, name, icon: Icon }) => (
        <div
          key={key}
          className="rounded-3xl bg-white p-5 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">{name}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {display(key)}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10">
              <Icon className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
