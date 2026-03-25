"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Loader2 } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { getTenants, type Tenant } from "@/lib/api/staff";

export function OrganizationsTable() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const [organizations, setOrganizations] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from staff API (which has full tenant details)
      const data = await getTenants();
      setOrganizations(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load organizations");
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { vi: string; en: string }> = {
      ACTIVE: { vi: "Hoạt động", en: "Active" },
      PENDING: { vi: "Chờ duyệt", en: "Pending" },
      SUSPENDED: { vi: "Tạm ngưng", en: "Suspended" },
      REJECTED: { vi: "Từ chối", en: "Rejected" },
    };
    return statusMap[status]?.[language] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "SUSPENDED":
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400";
      case "REJECTED":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
        <span className="text-sm text-zinc-500">{isEn ? "Loading..." : "Đang tải..."}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center dark:bg-zinc-950">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {isEn ? "Organization" : "Tổ chức"}
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {isEn ? "Contact Email" : "Email"}
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {isEn ? "Company Size" : "Quy mô"}
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {isEn ? "Status" : "Trạng thái"}
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {isEn ? "Created At" : "Ngày tạo"}
              </th>
              <th className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {organizations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-500">
                  {isEn ? "No organizations found." : "Không có tổ chức nào."}
                </td>
              </tr>
            ) : null}
            {organizations.map((org) => (
              <tr key={org.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">
                    {org.name}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">{org.contactEmail}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-zinc-900 dark:text-white">{org.companySize || "-"}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getStatusColor(org.status)}`}>
                    {getStatusLabel(org.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                  {org.createdAt
                    ? new Date(org.createdAt).toLocaleString(language === "vi" ? "vi-VN" : "en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-900">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
