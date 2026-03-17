"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  ClipboardCheck,
  PauseCircle,
  PlayCircle,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  getStaffDashboard,
  getTenants,
  approveTenant,
  suspendTenant,
  activateTenant,
  type Tenant,
  type TenantStatus,
  type StaffDashboardStats,
} from "@/lib/api/staff";

const statusLabel: Record<TenantStatus, string> = {
  PENDING: "Chờ duyệt",
  ACTIVE: "Đang hoạt động",
  REJECTED: "Từ chối",
  SUSPENDED: "Tạm ngưng",
};

const statusColor: Record<TenantStatus, string> = {
  PENDING: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  ACTIVE: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  REJECTED: "bg-red-500/20 text-red-700 dark:text-red-400",
  SUSPENDED: "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400",
};

export default function StaffDashboardPage() {
  const [stats, setStats] = useState<StaffDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TenantStatus | "ALL">("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = () => {
    setStatsLoading(true);
    setError(null);
    getStaffDashboard()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải thống kê"))
      .finally(() => setStatsLoading(false));
  };

  const loadTenants = () => {
    setTenantsLoading(true);
    setError(null);
    getTenants()
      .then(setTenants)
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi tải danh sách tenant"))
      .finally(() => setTenantsLoading(false));
  };

  useEffect(() => {
    loadDashboard();
    loadTenants();
  }, []);

  const handleApprove = (tenantId: string) => {
    setActionLoading(tenantId);
    approveTenant(tenantId)
      .then(() => {
        loadTenants();
        loadDashboard();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleSuspend = (tenantId: string) => {
    setActionLoading(tenantId);
    suspendTenant(tenantId)
      .then(() => {
        loadTenants();
        loadDashboard();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const handleActivate = (tenantId: string) => {
    setActionLoading(tenantId);
    activateTenant(tenantId)
      .then(() => {
        loadTenants();
        loadDashboard();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
      .finally(() => setActionLoading(null));
  };

  const filteredTenants =
    statusFilter === "ALL"
      ? tenants
      : tenants.filter((t) => t.status === statusFilter);

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-zinc-100 via-white to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <AppHeader />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Header */}
          <section className="overflow-hidden rounded-3xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-500/30 dark:shadow-emerald-900/40">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Staff Dashboard
              </h1>
              <p className="mt-1 max-w-xl text-sm text-emerald-50/90">
                Trung tâm điều phối cho đội ngũ Staff: phê duyệt tenant, quản lý subscription và theo dõi chỉ số thống kê toàn nền tảng.
              </p>
            </div>
          </section>

          {/* 1. Chỉ số thống kê (on dashboard) */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-500" />
              Chỉ số thống kê
            </h2>
            {statsLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <span className="text-sm text-zinc-500">Đang tải…</span>
              </div>
            ) : stats ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  icon={Building2}
                  label="Tổng tenants"
                  value={stats.tenants.total}
                />
                <StatCard
                  icon={ClipboardCheck}
                  label="Chờ duyệt"
                  value={stats.tenants.pending}
                  accent="amber"
                />
                <StatCard
                  icon={PlayCircle}
                  label="Đang hoạt động"
                  value={stats.tenants.active}
                  accent="emerald"
                />
                <StatCard
                  icon={PauseCircle}
                  label="Tạm ngưng"
                  value={stats.tenants.suspended}
                  accent="zinc"
                />
                <StatCard
                  icon={Users}
                  label="Tổng users"
                  value={stats.totalUsers}
                />
                <StatCard
                  icon={CreditCard}
                  label="Subscriptions"
                  value={stats.subscriptions.total}
                />
                <StatCard
                  icon={FileText}
                  label="Tài liệu"
                  value={stats.totalDocuments}
                />
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-6 text-center text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                {error || "Không có dữ liệu. Kiểm tra kết nối API."}
              </div>
            )}
          </section>

          {/* 2. Phê duyệt tenant */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-500" />
              Phê duyệt tenant
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Xem và duyệt yêu cầu đăng ký tenant; phê duyệt, tạm ngưng hoặc kích hoạt lại.
            </p>
            <div className="flex flex-wrap gap-2">
              {(["ALL", "PENDING", "ACTIVE", "SUSPENDED"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    statusFilter === s
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {s === "ALL" ? "Tất cả" : statusLabel[s]}
                </button>
              ))}
            </div>
            {tenantsLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <span className="text-sm text-zinc-500">Đang tải danh sách…</span>
              </div>
            ) : filteredTenants.length === 0 ? (
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                Không có tenant nào.
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Tên / Email</th>
                        <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Trạng thái</th>
                        <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTenants.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-zinc-900 dark:text-zinc-50">{t.name}</div>
                            <div className="text-xs text-zinc-500">{t.contactEmail}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[t.status]}`}
                            >
                              {statusLabel[t.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {t.status === "PENDING" && (
                                <button
                                  type="button"
                                  disabled={actionLoading === t.id}
                                  onClick={() => handleApprove(t.id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                                >
                                  {actionLoading === t.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : null}
                                  Phê duyệt
                                </button>
                              )}
                              {t.status === "ACTIVE" && (
                                <button
                                  type="button"
                                  disabled={actionLoading === t.id}
                                  onClick={() => handleSuspend(t.id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                                >
                                  {actionLoading === t.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : null}
                                  Tạm ngưng
                                </button>
                              )}
                              {t.status === "SUSPENDED" && (
                                <button
                                  type="button"
                                  disabled={actionLoading === t.id}
                                  onClick={() => handleActivate(t.id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                                >
                                  {actionLoading === t.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : null}
                                  Kích hoạt lại
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* 3. Quản lý subscription */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              Quản lý subscription
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Xem tenant và gói subscription đang gán. Gán gói phù hợp sau khi tenant được duyệt.
            </p>
            {tenantsLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Tenant</th>
                        <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Trạng thái</th>
                        <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Gói subscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-zinc-900 dark:text-zinc-50">{t.name}</div>
                            <div className="text-xs text-zinc-500">{t.contactEmail}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[t.status]}`}
                            >
                              {statusLabel[t.status]}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                            {t.subscriptionId ? (
                              <span className="text-xs font-mono">{t.subscriptionId}</span>
                            ) : (
                              <span className="text-zinc-400 dark:text-zinc-500">Chưa gán</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tenants.length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Chưa có tenant. Gán gói subscription sẽ thực hiện khi backend hỗ trợ API gán gói cho tenant.
                  </div>
                )}
              </div>
            )}
          </section>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
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
