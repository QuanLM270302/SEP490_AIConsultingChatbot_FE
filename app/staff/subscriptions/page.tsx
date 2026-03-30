"use client";

import { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import {
  Loader2,
  Eye,
  X,
  Filter,
} from "lucide-react";
import {
  getStaffSubscriptions,
  type StaffSubscription,
  type StaffSubscriptionStatus,
} from "@/lib/api/staff";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

const statusLabel: Record<StaffSubscriptionStatus, Record<"vi" | "en", string>> = {
  PENDING: { vi: "Chờ xử lý", en: "Pending" },
  ACTIVE: { vi: "Đang hoạt động", en: "Active" },
  TRIAL: { vi: "Dùng thử", en: "Trial" },
  EXPIRED: { vi: "Hết hạn", en: "Expired" },
  CANCELLED: { vi: "Đã hủy", en: "Cancelled" },
  CANCELED: { vi: "Đã hủy", en: "Cancelled" },
};

const statusColor: Record<StaffSubscriptionStatus, string> = {
  PENDING: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  ACTIVE: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  TRIAL: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  EXPIRED: "bg-zinc-500/20 text-zinc-700 dark:text-zinc-300",
  CANCELLED: "bg-red-500/20 text-red-700 dark:text-red-400",
  CANCELED: "bg-red-500/20 text-red-700 dark:text-red-400",
};

export default function StaffSubscriptionsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [subscriptions, setSubscriptions] = useState<StaffSubscription[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active">("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<StaffSubscription | null>(null);
  const [endpointMissing, setEndpointMissing] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setSubscriptionsLoading(true);
      const data = await getStaffSubscriptions();
      setSubscriptions(data);
      setEndpointMissing(false);
    } catch (e: any) {
      console.error("Failed to load subscriptions:", e);
      const msg = e instanceof Error ? e.message : "";
      const missing = /404|không tải được danh sách subscription/i.test(msg);
      setEndpointMissing(missing);
      setError(
        missing
          ? language === "en"
            ? "Staff subscriptions endpoint is not available yet."
            : "Endpoint staff subscriptions chưa sẵn sàng."
          : language === "en"
            ? "Failed to load subscriptions list"
            : "Không thể tải danh sách subscription"
      );
    } finally {
      setSubscriptionsLoading(false);
    }
  };

  const normalizeSubStatus = (status?: string): StaffSubscriptionStatus => {
    const key = (status || "PENDING").toUpperCase() as StaffSubscriptionStatus;
    if (key in statusLabel) return key;
    return "PENDING";
  };

  const extractTier = (item: StaffSubscription): string | null => {
    const tier = item.tier;
    if (typeof tier === "string" && tier.trim()) return tier.trim();
    return null;
  };

  const extractSubscriptionDisplay = (item: StaffSubscription): string => {
    const tier = extractTier(item);
    if (tier) return tier;
    if (item.subscriptionCode) return item.subscriptionCode;
    return t.notAssigned;
  };
  const shownSubscriptions = subscriptions.filter((item) => {
    if (statusFilter !== "active") return true;
    const st = normalizeSubStatus(item.status);
    return st === "ACTIVE" || st === "TRIAL";
  });

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
        {subscriptionsLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            <span className="text-sm text-zinc-500">{t.loadingList}</span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
            <div className="border-b border-zinc-200/80 bg-zinc-50/90 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <Filter className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{language === "en" ? "Filter" : "Lọc"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-zinc-100/80 p-1 dark:bg-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      statusFilter === "all"
                        ? "bg-white text-green-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:text-green-400 dark:ring-zinc-700"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {language === "en" ? "All" : "Tất cả"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("active")}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      statusFilter === "active"
                        ? "bg-white text-green-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:text-green-400 dark:ring-zinc-700"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {language === "en" ? "Active" : "Đang active"}
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.tenant}</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Tier</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.subscriptionPlan}</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.status}</th>
                    <th className="px-6 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {shownSubscriptions.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{item.tenantName}</div>
                        <div className="text-xs text-zinc-500">{item.tenantEmail || "—"}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                        {extractTier(item) ? (
                          <span className="inline-flex rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                            {extractTier(item)}
                          </span>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                        {item.planName || item.subscriptionCode ? (
                          <span className="text-xs font-mono">{item.planName || item.subscriptionCode}</span>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-500">{t.notAssigned}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[normalizeSubStatus(item.status)]}`}
                        >
                          {statusLabel[normalizeSubStatus(item.status)][language]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubscription(item);
                            setDetailOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {t.viewDetail}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {shownSubscriptions.length === 0 && (
              <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {language === "en" ? "No subscriptions found for current filter." : "Không có subscription theo bộ lọc hiện tại."}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {error}
            {endpointMissing ? (
              <p className="mt-2 text-xs">
                {language === "en"
                  ? "Please ask BE to provide GET /api/v1/staff/subscriptions."
                  : "Vui lòng yêu cầu BE cung cấp GET /api/v1/staff/subscriptions."}
              </p>
            ) : null}
          </div>
        )}
      </div>

      {detailOpen && selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {t.subscriptionPlan} - {selectedSubscription.tenantName}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setDetailOpen(false);
                  setSelectedSubscription(null);
                }}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Tenant</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{selectedSubscription.tenantName}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Status</span>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[normalizeSubStatus(selectedSubscription.status)]}`}>
                  {statusLabel[normalizeSubStatus(selectedSubscription.status)][language]}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Tier</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">{extractTier(selectedSubscription) || "—"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">Subscription</span>
                <span className="font-mono text-xs text-zinc-900 dark:text-zinc-50">{extractSubscriptionDisplay(selectedSubscription)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
