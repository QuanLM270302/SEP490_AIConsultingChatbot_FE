"use client";

import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import {
  getAdminSubscriptions,
  getActiveAdminSubscriptions,
  getAdminSubscriptionsByTenant,
  getAdminSubscriptionById,
  getAdminTenants,
  type AdminSubscriptionResponse,
  type AdminTenantSummary,
} from "@/lib/api/admin";
import { Loader2, Eye, Filter, ChevronDown } from "lucide-react";

type FilterMode = "all" | "active";

export default function SubscriptionsPage() {
  const [list, setList] = useState<AdminSubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [tenantIdFilter, setTenantIdFilter] = useState("");
  const [tenants, setTenants] = useState<AdminTenantSummary[]>([]);
  const [tenantsError, setTenantsError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminSubscriptionResponse | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    if (tenantIdFilter.trim()) {
      getAdminSubscriptionsByTenant(tenantIdFilter.trim())
        .then(setList)
        .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
        .finally(() => setLoading(false));
    } else if (filter === "active") {
      getActiveAdminSubscriptions()
        .then(setList)
        .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
        .finally(() => setLoading(false));
    } else {
      getAdminSubscriptions()
        .then(setList)
        .catch((e) => setError(e instanceof Error ? e.message : "Lỗi"))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    load();
  }, [filter, tenantIdFilter]);

  useEffect(() => {
    getAdminTenants()
      .then(setTenants)
      .catch((e) => setTenantsError(e instanceof Error ? e.message : "Không tải được danh sách tenant"));
  }, []);

  const handleViewDetail = (id: string) => {
    getAdminSubscriptionById(id)
      .then(setDetail)
      .catch((e) => alert(e instanceof Error ? e.message : "Lỗi"));
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Subscriptions – Tenant đã mua
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Xem tất cả subscriptions, lọc theo trạng thái active hoặc theo tenant
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
          {/* Toolbar: cùng padding ngang với bảng (px-6) — tenant căn phải thẳng hàng cột Thao tác */}
          <div className="border-b border-zinc-200/80 bg-zinc-50/90 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <Filter className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Lọc</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-zinc-100/80 p-1 dark:bg-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    disabled={!!tenantIdFilter.trim()}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      tenantIdFilter.trim()
                        ? "cursor-not-allowed opacity-50"
                        : filter === "all"
                          ? "bg-white text-green-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:text-green-400 dark:ring-zinc-700"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("active")}
                    disabled={!!tenantIdFilter.trim()}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      tenantIdFilter.trim()
                        ? "cursor-not-allowed opacity-50"
                        : filter === "active"
                          ? "bg-white text-green-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:text-green-400 dark:ring-zinc-700"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    Đang active
                  </button>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">
                <label
                  htmlFor="sub-tenant-filter"
                  className="shrink-0 text-sm font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Tenant
                </label>
                <div className="relative min-w-48 max-w-full flex-1 sm:max-w-[20rem] sm:flex-initial">
                  <select
                    id="sub-tenant-filter"
                    value={tenantIdFilter}
                    onChange={(e) => setTenantIdFilter(e.target.value)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-white py-2 pl-3.5 pr-10 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-500 dark:focus:border-green-500"
                  >
                    <option value="">Tất cả tenant</option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                        {t.status ? ` (${t.status})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
            {tenantsError ? (
              <p className="mt-3 text-right text-xs text-amber-600 dark:text-amber-400">{tenantsError}</p>
            ) : null}
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải…</span>
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center text-sm text-red-600 dark:text-red-400">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Tenant / Gói</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Tier</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Trạng thái</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Giá / Chu kỳ</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Bắt đầu / Hết hạn</th>
                    <th className="px-6 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                        Chưa có subscription hoặc không tìm thấy theo bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    list.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-zinc-900 dark:text-white">{s.tenantName ?? s.tenantId}</p>
                            <p className="text-xs font-mono text-zinc-500">{s.tenantId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{s.tier ?? "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.status === "ACTIVE" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"}`}>
                            {s.status ?? "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {s.price != null ? `${Number(s.price).toLocaleString("vi-VN")} ${s.currency ?? ""}` : "—"} / {s.billingCycle ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                          {s.startDate ? new Date(s.startDate).toLocaleDateString("vi-VN") : "—"} → {s.endDate ? new Date(s.endDate).toLocaleDateString("vi-VN") : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleViewDetail(s.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            <Eye className="h-3.5 w-3.5" /> Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60" onClick={() => setDetail(null)} />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-6 shadow-xl dark:bg-zinc-950">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Chi tiết subscription</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-zinc-500">ID</dt><dd className="font-mono text-zinc-900 dark:text-white">{detail.id}</dd></div>
              <div><dt className="text-zinc-500">Tenant</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.tenantName ?? detail.tenantId}</dd></div>
              <div><dt className="text-zinc-500">Tier / Status</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.tier ?? "—"} / {detail.status ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Giá / Chu kỳ</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.price != null ? `${Number(detail.price).toLocaleString("vi-VN")} ${detail.currency ?? ""}` : "—"} / {detail.billingCycle ?? "—"}</dd></div>
              <div><dt className="text-zinc-500">Bắt đầu / Hết hạn</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.startDate ? new Date(detail.startDate).toLocaleDateString("vi-VN") : "—"} → {detail.endDate ? new Date(detail.endDate).toLocaleDateString("vi-VN") : "—"}</dd></div>
              <div><dt className="text-zinc-500">Auto renew</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.autoRenew ? "Có" : "Không"}</dd></div>
              <div><dt className="text-zinc-500">Trial</dt><dd className="font-medium text-zinc-900 dark:text-white">{detail.isTrial ? "Có" : "Không"}</dd></div>
            </dl>
            <button type="button" onClick={() => setDetail(null)} className="mt-6 rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium dark:bg-zinc-700 dark:text-zinc-200">Đóng</button>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
