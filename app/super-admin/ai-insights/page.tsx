"use client";

import { useState } from "react";
import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { ThumbsUp, ThumbsDown, MessageSquare, Building2, AlertTriangle, CheckCircle } from "lucide-react";

// Mock data (backend coming soon)
const mockOverview = {
  totalMessages: 12480,
  helpfulPercent: 78,
  notHelpfulPercent: 22,
  activeTenants: 6,
};

const mockTenants = [
  { name: "Gamma Inc", helpfulPercent: 45, totalMessages: 450 },
  { name: "Beta Ltd", helpfulPercent: 62, totalMessages: 980 },
  { name: "Acme Corp", helpfulPercent: 85, totalMessages: 1200 },
  { name: "Delta Systems", helpfulPercent: 92, totalMessages: 2100 },
  { name: "Epsilon Tech", helpfulPercent: 73, totalMessages: 890 },
  { name: "Zeta Industries", helpfulPercent: 88, totalMessages: 1560 },
];

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

  // Sort by helpful % ascending (worst performing first)
  const sortedTenants = [...mockTenants].sort((a, b) => a.helpfulPercent - b.helpfulPercent);
  const lowPerformingTenants = sortedTenants.filter((t) => t.helpfulPercent < 70);

  return (
    <SuperAdminLayout>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {mockOverview.helpfulPercent}%
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
                  {mockOverview.notHelpfulPercent}%
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
                  {mockOverview.totalMessages.toLocaleString()}
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
                  {mockOverview.activeTenants}
                </span>
              </div>
              <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
                {isEn ? "Active Tenants" : "Tenant hoạt động"}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Low Performing Tenants */}
        {lowPerformingTenants.length > 0 ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  {isEn ? "Low Performing Tenants" : "Tenant hiệu suất thấp"}
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-amber-800 dark:text-amber-200">
                  {lowPerformingTenants.map((tenant, idx) => (
                    <li key={idx}>
                      • {tenant.name} — {tenant.helpfulPercent}% {isEn ? "helpful" : "hữu ích"} ({tenant.totalMessages.toLocaleString()} {isEn ? "messages" : "tin nhắn"})
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
        )}

        {/* Section 2: Tenant Performance Table */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {isEn ? "Tenant Performance" : "Hiệu suất Tenant"}
          </h2>
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
                {sortedTenants.map((tenant, idx) => {
                  const status = getStatusBadge(tenant.helpfulPercent, isEn);
                  return (
                    <tr
                      key={idx}
                      className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      title={isEn ? "Click for details (coming soon)" : "Nhấp để xem chi tiết (sắp có)"}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">
                        {tenant.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                        {tenant.helpfulPercent}%
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
        </div>
      </div>
    </SuperAdminLayout>
  );
}
