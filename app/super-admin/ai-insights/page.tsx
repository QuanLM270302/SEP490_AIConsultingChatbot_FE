"use client";

import { useEffect, useState } from "react";
import { getAIOverview, getTenantPerformance, type AIOverview, type TenantPerformance } from "@/lib/api/feedback";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { ThumbsUp, ThumbsDown, MessageSquare, Building2, AlertTriangle, CheckCircle } from "lucide-react";

function getStatusBadge(percent: number, isEn: boolean) {
  if (percent < 70) {
    return {
      label: isEn ? "Needs Attention" : "Cần chú ý",
      icon: "🔴",
      className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
    };
  }
  if (percent <= 85) {
    return {
      label: isEn ? "Good" : "Tốt",
      icon: "🟡",
      className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
    };
  }
  return {
    label: isEn ? "Excellent" : "Xuất sắc",
    icon: "🟢",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
  };
}

export default function SuperAdminAIInsightsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const [overview, setOverview] = useState<AIOverview | null>(null);
  const [tenants, setTenants] = useState<TenantPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAIOverview(), getTenantPerformance()])
      .then(([overviewData, tenantsData]) => {
        setOverview(overviewData);
        setTenants(tenantsData);
      })
      .catch((e) => {
        console.warn("Failed to load AI insights:", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const lowPerformingTenants = tenants.filter((t) => t.lowPerforming);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {isEn ? "AI Insights" : "Thông tin AI"}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "System-wide AI performance and tenant analytics" : "Hiệu suất AI toàn hệ thống và phân tích tenant"}
          </p>
        </div>

        {/* Section 1: System Overview */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {isEn ? "System Overview" : "Tổng quan hệ thống"}
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
          ) : !overview ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {isEn ? "No system data available yet" : "Chưa có dữ liệu hệ thống"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {Math.round(overview.helpfulPercent)}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                  {isEn ? "Helpful" : "Hữu ích"}
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <span className="text-2xl font-bold text-red-900 dark:text-red-100">
                    {Math.round(overview.notHelpfulPercent)}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {isEn ? "Not Helpful" : "Không hữu ích"}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {overview.totalMessages.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                  {isEn ? "Messages" : "Tin nhắn"}
                </p>
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950/30">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {tenants.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                  {isEn ? "Active Tenants" : "Tenant hoạt động"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Low Performing Tenants Warning */}
        {!loading && (
          lowPerformingTenants.length > 0 ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                    {isEn ? "⚠️ Low Performing Tenants" : "⚠️ Tenant hiệu suất thấp"}
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
                    {lowPerformingTenants.map((tenant, idx) => (
                      <li key={idx}>
                        • {tenant.tenantName} — {Math.round(tenant.helpfulPercent)}% {isEn ? "helpful" : "hữu ích"} ({tenant.totalMessages.toLocaleString()} {isEn ? "messages" : "tin nhắn"})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-emerald-900 dark:text-emerald-100">
                  {isEn ? "All tenants performing well ✅" : "Tất cả tenant hoạt động tốt ✅"}
                </span>
              </div>
            </div>
          )
        )}

        {/* Section 3: Tenant Performance Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {isEn ? "Tenant Performance" : "Hiệu suất Tenant"}
          </h2>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "Sorted by helpful percentage (worst performing first)" : "Sắp xếp theo % hữu ích (hiệu suất thấp nhất trước)"}
          </p>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            </div>
          ) : tenants.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {isEn ? "No tenant data available yet" : "Chưa có dữ liệu tenant"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {isEn ? "Tenant Name" : "Tên Tenant"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {isEn ? "Helpful %" : "% Hữu ích"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {isEn ? "Total Messages" : "Tổng tin nhắn"}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {isEn ? "Status" : "Trạng thái"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {tenants.map((tenant, idx) => {
                    const status = getStatusBadge(tenant.helpfulPercent, isEn);
                    return (
                      <tr
                        key={idx}
                        className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                        title={isEn ? "Click for details (coming soon)" : "Nhấp để xem chi tiết (sắp có)"}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">
                          {tenant.tenantName}
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                          {Math.round(tenant.helpfulPercent)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                          {tenant.totalMessages.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
                            <span>{status.icon}</span>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}
