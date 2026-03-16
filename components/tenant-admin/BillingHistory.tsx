"use client";

import { Download, CheckCircle, Clock } from "lucide-react";

const invoices = [
  { id: "INV-1077", date: "Mar 2026", amount: "1,500,000đ", status: "pending" },
  { id: "INV-1044", date: "Feb 2026", amount: "1,500,000đ", status: "paid" },
  { id: "INV-1023", date: "Jan 2026", amount: "1,500,000đ", status: "paid" },
  { id: "INV-0998", date: "Dec 2025", amount: "1,500,000đ", status: "paid" },
];

export function BillingHistory() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="border-b border-zinc-100 px-8 py-6 dark:border-zinc-900">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
          Billing History
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Lịch sử thanh toán và hóa đơn
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Invoice ID
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Status
              </th>
              <th className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                  {invoice.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {invoice.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-900 dark:text-white">
                  {invoice.amount}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      invoice.status === "paid"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {invoice.status === "paid" ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Paid
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        Pending
                      </>
                    )}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
                    <Download className="h-3 w-3" />
                    Download
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
