"use client";

import { CreditCard, Calendar, TrendingUp } from "lucide-react";

export function SubscriptionInfo() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg shadow-green-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20">
          <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Current Plan
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Gói dịch vụ hiện tại
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white/60 p-6 dark:bg-zinc-800/40">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-zinc-900 dark:text-white">
            Business
          </span>
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
            Active
          </span>
        </div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
          1,500,000đ
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            /month
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            Next billing date
          </span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            March 15, 2026
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <TrendingUp className="h-4 w-4" />
            Renewal
          </span>
          <span className="font-semibold text-zinc-900 dark:text-white">
            Auto-renew enabled
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 rounded-2xl bg-green-500 px-4 py-3 font-semibold text-white hover:bg-green-600">
          Upgrade Plan
        </button>
        <button className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
          Manage
        </button>
      </div>
    </div>
  );
}
