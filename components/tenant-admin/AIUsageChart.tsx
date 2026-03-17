"use client";

import { MessageSquare, TrendingUp } from "lucide-react";

const usageData = [
  { day: "Mon", queries: 980 },
  { day: "Tue", queries: 1120 },
  { day: "Wed", queries: 1050 },
  { day: "Thu", queries: 1280 },
  { day: "Fri", queries: 1450 },
  { day: "Sat", queries: 680 },
  { day: "Sun", queries: 520 },
];

export function AIUsageChart() {
  const maxValue = Math.max(...usageData.map((d) => d.queries));
  const totalQueries = usageData.reduce((sum, d) => sum + d.queries, 0);
  const avgQueries = Math.round(totalQueries / usageData.length);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg shadow-blue-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              AI Usage This Week
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Số lượng truy vấn AI theo ngày
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-blue-500/20 px-4 py-2">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {avgQueries}/day
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-end justify-between gap-2">
        {usageData.map((data, index) => {
          const heightPercentage = (data.queries / maxValue) * 100;
          return (
            <div
              key={data.day}
              className="group flex flex-1 flex-col items-center gap-3"
            >
              <div className="relative w-full">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-700 ease-out group-hover:shadow-blue-500/50"
                  style={{
                    height: `${Math.max(heightPercentage * 1.2, 30)}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                    {data.queries}
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {data.day}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6 rounded-2xl bg-white/60 p-5 dark:bg-zinc-800/40">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {totalQueries.toLocaleString()}
          </p>
        </div>
        <div className="text-center border-x border-zinc-200 dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Avg/Day
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {avgQueries}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Peak
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {maxValue}
          </p>
        </div>
      </div>
    </div>
  );
}
