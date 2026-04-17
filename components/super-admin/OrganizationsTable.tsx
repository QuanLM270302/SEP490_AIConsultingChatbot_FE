"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ErrorNotice } from "@/components/ui";
import { useLanguageStore } from "@/lib/language-store";
import { getAdminTenants, type AdminTenantSummary } from "@/lib/api/admin";

export function OrganizationsTable() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const [organizations, setOrganizations] = useState<AdminTenantSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminTenants();
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
        <ErrorNotice message={error} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="table-scroll-container">
        <table className="min-w-xl table-auto divide-y divide-zinc-100 dark:divide-zinc-900 lg:min-w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {isEn ? "Organization" : "Tổ chức"}
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                ID
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {isEn ? "Status" : "Trạng thái"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {organizations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-zinc-500">
                  {isEn ? "No organizations found." : "Không có tổ chức nào."}
                </td>
              </tr>
            ) : null}
            {organizations.map((org) => (
              <tr key={org.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="px-4 py-4 align-top sm:px-6">
                  <div className="max-w-64 whitespace-normal wrap-break-word text-sm font-medium text-zinc-900 dark:text-white">
                    {org.name}
                  </div>
                </td>
                <td className="px-4 py-4 align-top sm:px-6">
                  <div className="max-w-64 break-all text-xs font-mono text-zinc-600 dark:text-zinc-400">
                    {org.id}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 align-top sm:px-6">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getStatusColor(org.status ?? "")}`}>
                    {getStatusLabel(org.status ?? "UNKNOWN")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
