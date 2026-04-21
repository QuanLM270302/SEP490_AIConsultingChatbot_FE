"use client";

import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import type { PaymentHistoryItem } from "@/lib/api/payment";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface BillingHistoryProps {
  payments: PaymentHistoryItem[];
  loading?: boolean;
}

export function BillingHistory({ payments, loading }: BillingHistoryProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const statusConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
    SUCCESS: {
      label: t.paid,
      icon: CheckCircle,
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    PENDING: {
      label: t.pending,
      icon: Clock,
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    FAILED: {
      label: t.failed,
      icon: XCircle,
      className: "bg-red-500/10 text-red-600 dark:text-red-400",
    },
    EXPIRED: {
      label: t.expired,
      icon: Clock,
      className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    },
    CANCELLED: {
      label: language === "en" ? "Cancelled" : "Đã hủy",
      icon: XCircle,
      className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 shadow-lg dark:bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        <span className="text-sm text-zinc-500">{t.loading}…</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="border-b border-zinc-100 px-8 py-6 dark:border-zinc-900">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          {t.paymentHistory}
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t.paymentHistoryDescription}
        </p>
      </div>
      <div className="overflow-x-auto">
        {payments.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {language === "en" ? "No payment history yet." : "Chưa có"}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {t.transactionCode}
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {t.createdDate}
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {t.plan}
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {t.amount}
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {t.status}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
              {payments.map((p) => {
                const config = statusConfig[p.status] || statusConfig.PENDING;
                const Icon = config.icon;
                return (
                  <tr key={p.payment_id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white font-mono">
                      {p.transaction_code}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                      {p.tier}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
                      {typeof p.amount === "number"
                        ? `${p.amount.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}${p.currency === "VND" ? "đ" : ` ${p.currency}`}`
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${config.className}`}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
