"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { getAuditLogs, type AuditLogEntry } from "@/lib/api/audit-logs";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { ClipboardList, CheckCircle, XCircle } from "lucide-react";

const ACTION_COLORS: Record<string, string> = {
  USER_CREATE: "emerald",
  USER_ACTIVATE: "emerald",
  DOCUMENT_UPLOAD: "emerald",
  USER_UPDATE: "blue",
  USER_PERMISSION_UPDATE: "blue",
  USER_PASSWORD_RESET: "blue",
  USER_DEACTIVATE: "red",
  USER_DELETE: "red",
  DOCUMENT_DELETE: "red",
};

function getActionColor(action: string): string {
  return ACTION_COLORS[action] ?? "zinc";
}

function getActionBadgeClasses(action: string): string {
  const color = getActionColor(action);
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
    red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
    zinc: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  };
  return colorMap[color] ?? colorMap.zinc;
}

function formatActionLabel(action: string, isEn: boolean): string {
  const labels: Record<string, { en: string; vi: string }> = {
    USER_CREATE: { en: "User Create", vi: "Tạo người dùng" },
    USER_UPDATE: { en: "User Update", vi: "Cập nhật người dùng" },
    USER_ACTIVATE: { en: "User Activate", vi: "Kích hoạt người dùng" },
    USER_DEACTIVATE: { en: "User Deactivate", vi: "Vô hiệu hóa người dùng" },
    USER_PASSWORD_RESET: { en: "Password Reset", vi: "Đặt lại mật khẩu" },
    USER_PERMISSION_UPDATE: { en: "Permission Update", vi: "Cập nhật quyền" },
    USER_DELETE: { en: "User Delete", vi: "Xóa người dùng" },
    DOCUMENT_UPLOAD: { en: "Document Upload", vi: "Tải tài liệu" },
    DOCUMENT_DELETE: { en: "Document Delete", vi: "Xóa tài liệu" },
  };
  return labels[action]?.[isEn ? "en" : "vi"] ?? action;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [actionFilter, setActionFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    getAuditLogs(50)
      .then((data) => {
        setLogs(data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : isEn ? "Failed to load audit logs" : "Không tải được nhật ký hoạt động");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isEn]);

  const totalActions = logs.length;
  const successfulActions = logs.filter((log) => log.status === "SUCCESS").length;
  const failedActions = logs.filter((log) => log.status === "FAILED").length;

  const filteredLogs = logs.filter((log) => {
    if (actionFilter && log.action !== actionFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.userEmail.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  if (loading) {
    return (
      <TenantAdminLayout>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isEn ? "Loading audit logs..." : "Đang tải nhật ký hoạt động..."}
            </p>
          </div>
        </div>
      </TenantAdminLayout>
    );
  }

  return (
    <TenantAdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isEn ? "Audit Logs" : "Nhật ký hoạt động"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isEn ? "Track all system activities and changes" : "Theo dõi tất cả hoạt động và thay đổi hệ thống"}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <ClipboardList className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalActions}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isEn ? "Total Actions" : "Tổng số hành động"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{successfulActions}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isEn ? "Successful" : "Thành công"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{failedActions}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isEn ? "Failed" : "Thất bại"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search by user or description..." : "Tìm kiếm theo người dùng hoặc mô tả..."}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <option value="">{isEn ? "All Actions" : "Tất cả hành động"}</option>
              <option disabled>──────────────</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {formatActionLabel(action, isEn)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setActionFilter("");
                setSearchQuery("");
              }}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {isEn ? "Clear Filters" : "Xóa bộ lọc"}
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {isEn ? "Time" : "Thời gian"}
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {isEn ? "Action" : "Hành động"}
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {isEn ? "Description" : "Mô tả"}
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {isEn ? "Performed By" : "Thực hiện bởi"}
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {isEn ? "Status" : "Trạng thái"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {isEn ? "No audit logs found" : "Chưa có nhật ký hoạt động"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {isEn ? "Activity logs will appear here" : "Nhật ký hoạt động sẽ xuất hiện ở đây"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                      {new Date(log.createdAt).toLocaleString(isEn ? "en-US" : "vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${getActionBadgeClasses(log.action)}`}
                      >
                        {formatActionLabel(log.action, isEn)}
                      </span>
                    </td>
                    <td className="max-w-md px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                      <div className="truncate" title={log.description}>
                        {log.description.length > 100
                          ? `${log.description.slice(0, 100)}...`
                          : log.description}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                      {log.userEmail}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      {log.status === "SUCCESS" ? (
                        <CheckCircle className="mx-auto h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="mx-auto h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </TenantAdminLayout>
  );
}
