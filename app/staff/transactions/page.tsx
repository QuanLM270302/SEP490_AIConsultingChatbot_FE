"use client";

import { useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff/StaffLayout";
import {
  Loader2,
  Eye,
  X,
} from "lucide-react";
import {
  getTransactions,
  getTransactionById,
  type Transaction,
  type TransactionStatus,
} from "@/lib/api/staff";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

const transactionStatusLabel: Record<TransactionStatus, Record<'vi' | 'en', string>> = {
  PENDING: { vi: "Chờ xử lý", en: "Pending" },
  COMPLETED: { vi: "Hoàn thành", en: "Completed" },
  FAILED: { vi: "Thất bại", en: "Failed" },
  REFUNDED: { vi: "Hoàn tiền", en: "Refunded" },
};

const transactionStatusColor: Record<TransactionStatus, string> = {
  PENDING: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  FAILED: "bg-red-500/20 text-red-700 dark:text-red-400",
  REFUNDED: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
};

export default function StaffTransactionsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<TransactionStatus | "ALL">("ALL");
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
      setError("Không thể tải danh sách giao dịch");
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
      setError("Không thể tải chi tiết giao dịch");
    }
  };

  const filteredTransactions =
    transactionStatusFilter === "ALL"
      ? transactions
      : transactions.filter((tx) => tx.status === transactionStatusFilter);

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

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTransactionStatusFilter(s)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                transactionStatusFilter === s
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {s === "ALL" ? t.all : transactionStatusLabel[s][language]}
            </button>
          ))}
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
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.tenant}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.amount}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.status}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.createdDate}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{tx.tenantName}</div>
                        {tx.description && (
                          <div className="text-xs text-zinc-500">{tx.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                          {new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
                            style: "currency",
                            currency: tx.currency || "VND",
                          }).format(tx.amount)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${transactionStatusColor[tx.status]}`}
                        >
                          {transactionStatusLabel[tx.status][language]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                        {new Date(tx.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openTransactionDetailModal(tx.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
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
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${transactionStatusColor[selectedTransaction.status]}`}>
                        {transactionStatusLabel[selectedTransaction.status][language]}
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
                      {new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
                        style: "currency",
                        currency: selectedTransaction.currency || "VND",
                      }).format(selectedTransaction.amount)}
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
