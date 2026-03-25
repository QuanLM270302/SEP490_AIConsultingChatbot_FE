"use client";

import { TrendingUp, Users } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

const growthData = [
  { month: "Jan", count: 2 },
  { month: "Feb", count: 3 },
  { month: "Mar", count: 5 },
  { month: "Apr", count: 4 },
  { month: "May", count: 6 },
  { month: "Jun", count: 8 },
];

export function TenantGrowth() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const maxValue = Math.max(...growthData.map((d) => d.count));
  const totalNew = growthData.reduce((sum, d) => sum + d.count, 0);
  const avgGrowth = (totalNew / growthData.length).toFixed(1);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-lg shadow-emerald-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20">
              <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              Tenant Growth
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "New tenants by month" : "Tenant mới theo tháng"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-4 py-2">
          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            +{avgGrowth}/mo
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between gap-2">
        {growthData.map((data, index) => {
          const heightPercentage = (data.count / maxValue) * 100;
          return (
            <div
              key={data.month}
              className="group flex flex-1 flex-col items-center gap-3"
            >
              <div className="relative w-full">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-emerald-400 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 transition-all duration-700 ease-out group-hover:shadow-emerald-500/50"
                  style={{
                    height: `${Math.max(heightPercentage * 1.2, 30)}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                    {data.count} tenants
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {data.month}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white/60 p-5 dark:bg-zinc-800/40">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {isEn ? "Total New" : "Tổng mới"}
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {totalNew}
          </p>
        </div>
        <div className="text-center border-l border-zinc-200 dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Avg/Month
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {avgGrowth}
          </p>
        </div>
      </div>
    </div>
  );
}
