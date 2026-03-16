"use client";

import { MessageSquare, TrendingUp } from "lucide-react";

const queryData = [
  { month: "Jan", queries: 12400 },
  { month: "Feb", queries: 18200 },
  { month: "Mar", queries: 24800 },
  { month: "Apr", queries: 28600 },
  { month: "May", queries: 35400 },
  { month: "Jun", queries: 45200 },
];

export function AIQueriesChart() {
  const maxValue = Math.max(...queryData.map((d) => d.queries));

  return (
    <div className="rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg shadow-green-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/20">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              AI Queries Trend
            </h3>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Số lượng truy vấn AI theo tháng
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-green-500/20 px-4 py-2">
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            +24%
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {queryData.map((data, index) => {
          const percentage = (data.queries / maxValue) * 100;
          return (
            <div key={data.month} className="group space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {data.month}
                </span>
                <span className="text-base font-bold text-zinc-900 dark:text-white">
                  {data.queries.toLocaleString()}
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/60 dark:bg-zinc-800/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 shadow-lg shadow-green-500/30 transition-all duration-700 ease-out group-hover:shadow-green-500/50"
                  style={{ 
                    width: `${percentage}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6 rounded-2xl bg-white/60 p-5 dark:bg-zinc-800/40">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Avg/Day
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            1,507
          </p>
        </div>
        <div className="text-center border-x border-zinc-200 dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Peak
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            2,840
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total
          </p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            164.6K
          </p>
        </div>
      </div>
    </div>
  );
}
