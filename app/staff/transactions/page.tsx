"use client";

import { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import {
  Loader2,
  Eye,
  Filter,
  X,
} from "lucide-react";
import {
  getTransactions,
  getTransactionById,
  type Transaction,
} from "@/lib/api/staff";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

type UiTransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | "CANCELLED";

const transactionStatusLabel: Record<UiTransactionStatus, Record<"vi" | "en", string>> = {
  PENDING: { vi: "Chờ xử lý", en: "Pending" },
  SUCCESS: { vi: "Thành công", en: "Success" },
  FAILED: { vi: "Thất bại", en: "Failed" },
  REFUNDED: { vi: "Hoàn tiền", en: "Refunded" },
  CANCELLED: { vi: "Đã hủy", en: "Cancelled" },
};

const transactionStatusColor: Record<UiTransactionStatus, string> = {
  PENDING: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  SUCCESS: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  FAILED: "bg-red-500/20 text-red-700 dark:text-red-400",
  REFUNDED: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  CANCELLED: "bg-zinc-500/20 text-zinc-700 dark:text-zinc-300",
};

export default function StaffTransactionsPage() {
  const { language } = useLanguageStore();
  const langKey: "vi" | "en" = language === "en" ? "en" : "vi";
  const t = translations[language];
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<UiTransactionStatus | "ALL">("ALL");
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [transactionDetailModalOpen, setTransactionDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (e) {
      console.error("Failed to load transactions:", e);
      setError(language === "en" ? "Failed to load transactions list" : "Không thể tải danh sách giao dịch");
    } finally {
      setTransactionsLoading(false);
    }
  };

  const openTransactionDetailModal = async (transactionId: string) => {
    setTransactionDetailModalOpen(true);
    setSelectedTransaction(null);
    try {
      const transaction = await getTransactionById(transactionId);
      setSelectedTransaction(transaction);
    } catch (e) {
      console.error("Failed to load transaction details:", e);
      setError(language === "en" ? "Failed to load transaction details" : "Không thể tải chi tiết giao dịch");
    }
  };

  const normalizeStatus = (status: string): UiTransactionStatus => {
    const key = (status || "").toUpperCase();
    if (key === "COMPLETED" || key === "SUCCESS") return "SUCCESS";
    if (key === "CANCELLED" || key === "CANCELED") return "CANCELLED";
    if (key === "FAILED") return "FAILED";
    if (key === "REFUNDED") return "REFUNDED";
    return "PENDING";
  };

  const statusOrder: Record<UiTransactionStatus, number> = {
    PENDING: 0,
    FAILED: 1,
    CANCELLED: 2,
    REFUNDED: 3,
    SUCCESS: 4,
  };

  const filteredTransactions = (transactionStatusFilter === "ALL"
    ? transactions
    : transactions.filter((tx) => normalizeStatus(tx.status) === transactionStatusFilter)
  ).slice().sort((a, b) => {
    const byStatus = statusOrder[normalizeStatus(a.status)] - statusOrder[normalizeStatus(b.status)];
    if (byStatus !== 0) return byStatus;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getStatusLabel = (status: string) => {
    const map = transactionStatusLabel[normalizeStatus(status)];
    return map ? map[langKey] : status || "UNKNOWN";
  };
  const getStatusColor = (status: string) => {
    const key = normalizeStatus(status);
    return (
      transactionStatusColor[key] ??
      "bg-zinc-500/20 text-zinc-700 dark:text-zinc-300"
    );
  };
  const formatMoney = (amount: number) => {
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    return `${safeAmount.toLocaleString(language === "vi" ? "vi-VN" : "en-US", {
      maximumFractionDigits: 0,
    })} đ`;
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.manageTransactions}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t.transactionsDescription}
          </p>
        </div>

        {/* Transactions Table */}
        {transactionsLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 dark:bg-zinc-950">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            <span className="text-sm text-zinc-500">{t.loadingList}</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            {t.noTransactions}
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
                <div className="flex flex-wrap items-center gap-2 rounded-full bg-zinc-100/80 p-1 dark:bg-zinc-800/80">
                  {(["ALL", "PENDING", "SUCCESS", "FAILED", "CANCELLED", "REFUNDED"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTransactionStatusFilter(s)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        transactionStatusFilter === s
                          ? "bg-white text-green-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:text-green-400 dark:ring-zinc-700"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                      }`}
                    >
                      {s === "ALL" ? t.all : getStatusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.tenant}</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.amount}</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.status}</th>
                    <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.createdDate}</th>
                    <th className="px-6 py-3 text-right font-semibold text-zinc-700 dark:text-zinc-300">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{tx.tenantName}</div>
                        {tx.description && (
                          <div className="text-xs text-zinc-500">{tx.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {formatMoney(tx.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(tx.status)}`}
                        >
                          {getStatusLabel(tx.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                        {new Date(tx.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openTransactionDetailModal(tx.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          title={t.viewDetail}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {transactionDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {t.transactionDetail}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setTransactionDetailModalOpen(false);
                  setSelectedTransaction(null);
                }}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!selectedTransaction ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                <span className="text-sm text-zinc-500">{t.loading}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.transactionId}</label>
                    <p className="mt-1 text-xs font-mono text-zinc-900 dark:text-zinc-50">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.status}</label>
                    <p className="mt-1">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                        {getStatusLabel(selectedTransaction.status)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.tenant}</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.tenantName}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.tenantId}</label>
                    <p className="mt-1 text-xs font-mono text-zinc-900 dark:text-zinc-50">{selectedTransaction.tenantId}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.amount}</label>
                    <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.currency}</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.currency || "VND"}</p>
                  </div>
                  {selectedTransaction.paymentMethod && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.paymentMethod}</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.paymentMethod}</p>
                    </div>
                  )}
                  {selectedTransaction.transactionType && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.transactionType}</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">{selectedTransaction.transactionType}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.createdDate}</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                      {new Date(selectedTransaction.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                    </p>
                  </div>
                  {selectedTransaction.updatedAt && (
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.updatedDate}</label>
                      <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                        {new Date(selectedTransaction.updatedAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                      </p>
                    </div>
                  )}
                </div>
                {selectedTransaction.description && (
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.description}</label>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap">{selectedTransaction.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
