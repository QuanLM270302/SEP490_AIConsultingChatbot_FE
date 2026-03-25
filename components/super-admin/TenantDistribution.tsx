"use client";

import { PieChart } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

const planData: { name: string; count: number; color: string; percentage: number }[] = [];

export function TenantDistribution() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const total = planData.reduce((sum, plan) => sum + plan.count, 0);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20">
          <PieChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            Plan Distribution
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "Tenant distribution by plan" : "Phân bố tenant theo gói"}
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="mb-6 text-center">
        <p className="text-5xl font-bold text-zinc-900 dark:text-white">
          {total}
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {isEn ? "Total Tenants" : "Tổng tenant"}
        </p>
      </div>

      {/* Bar Chart */}
      <div className="space-y-5">
        {planData.map((plan) => (
          <div key={plan.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${plan.color}`} />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {plan.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                  {plan.count}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  ({plan.percentage}%)
                </span>
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  plan.color === "bg-blue-500"
                    ? "bg-gradient-to-r from-blue-400 to-blue-600"
                    : plan.color === "bg-green-500"
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-purple-400 to-purple-600"
                }`}
                style={{ width: `${plan.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
        {planData.map((plan) => (
          <div key={plan.name} className="text-center">
            <div className={`mx-auto mb-1 h-2 w-2 rounded-full ${plan.color}`} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {plan.name}
            </p>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
              {plan.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
