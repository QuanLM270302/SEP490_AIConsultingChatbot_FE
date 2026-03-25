"use client";

import { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import {
  Loader2,
} from "lucide-react";
import {
  getTenants,
  type Tenant,
  type TenantStatus,
} from "@/lib/api/staff";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

const statusLabel: Record<TenantStatus, Record<'vi' | 'en', string>> = {
  PENDING: { vi: "Chờ duyệt", en: "Pending" },
  ACTIVE: { vi: "Đang hoạt động", en: "Active" },
  REJECTED: { vi: "Từ chối", en: "Rejected" },
  SUSPENDED: { vi: "Tạm ngưng", en: "Suspended" },
};

const statusColor: Record<TenantStatus, string> = {
  PENDING: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  ACTIVE: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  REJECTED: "bg-red-500/20 text-red-700 dark:text-red-400",
  SUSPENDED: "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400",
};

export default function StaffSubscriptionsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setTenantsLoading(true);
      const data = await getTenants();
      setTenants(data);
    } catch (e) {
      console.error("Failed to load tenants:", e);
      setError("Không thể tải danh sách tenant");
    } finally {
      setTenantsLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.manageSubscriptions}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t.subscriptionsDescription}
          </p>
        </div>

        {/* Subscriptions Table */}
        {tenantsLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            <span className="text-sm text-zinc-500">{t.loadingList}</span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.tenant}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.status}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.subscriptionPlan}</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{tenant.name}</div>
                        <div className="text-xs text-zinc-500">{tenant.contactEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[tenant.status]}`}
                        >
                          {statusLabel[tenant.status][language]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {tenant.subscriptionId ? (
                          <span className="text-xs font-mono">{tenant.subscriptionId}</span>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-500">{t.notAssigned}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tenants.length === 0 && (
              <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {t.noTenantsYet}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
