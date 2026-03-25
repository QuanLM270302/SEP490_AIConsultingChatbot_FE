"use client";

import { DollarSign, TrendingUp } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

const revenueData = [
  { month: "Jan", revenue: 45000, growth: 12 },
  { month: "Feb", revenue: 52000, growth: 15 },
  { month: "Mar", revenue: 61000, growth: 17 },
  { month: "Apr", revenue: 58000, growth: -5 },
  { month: "May", revenue: 72000, growth: 24 },
  { month: "Jun", revenue: 85000, growth: 18 },
];

export function RevenueChart() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const maxValue = Math.max(...revenueData.map((d) => d.revenue));
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const avgGrowth = (revenueData.reduce((sum, d) => sum + d.growth, 0) / revenueData.length).toFixed(1);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg shadow-blue-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Revenue Trend
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "Monthly revenue (USD)" : "Doanh thu theo tháng (USD)"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-blue-500/20 px-4 py-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            +{avgGrowth}%
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between gap-2">
        {revenueData.map((data, index) => {
          const heightPercentage = (data.revenue / maxValue) * 100;
          return (
            <div key={data.month} className="group flex flex-1 flex-col items-center gap-3">
              <div className="relative w-full">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-700 ease-out group-hover:shadow-blue-500/50"
                  style={{ 
                    height: `${Math.max(heightPercentage * 1.5, 40)}px`,
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                    ${(data.revenue / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {data.month}
                </p>
                <p className={`mt-1 text-[10px] font-bold ${
                  data.growth >= 0 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {data.growth >= 0 ? "+" : ""}{data.growth}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 rounded-2xl bg-white/60 p-5 dark:bg-zinc-800/40">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {isEn ? "Total" : "Tổng"}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            ${(totalRevenue / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="text-center border-x border-zinc-200 dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Avg/Month
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            ${(totalRevenue / revenueData.length / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {isEn ? "Best Month" : "Tháng cao nhất"}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            ${(maxValue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>
    </div>
  );
}
