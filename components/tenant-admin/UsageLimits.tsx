"use client";

import { Users, FileText, MessageSquare, HardDrive } from "lucide-react";

const limits = [
  { name: "Users", current: 120, max: 200, icon: Users, percentage: 60 },
  { name: "Documents", current: 480, max: 1000, icon: FileText, percentage: 48 },
  { name: "AI Queries", current: 24680, max: 50000, icon: MessageSquare, percentage: 49 },
  { name: "Storage", current: "2.3GB", max: "10GB", icon: HardDrive, percentage: 23 },
];

export function UsageLimits() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
        Usage Limits
      </h3>
      <div className="space-y-6">
        {limits.map((limit) => {
          const Icon = limit.icon;
          const isNearLimit = limit.percentage >= 80;
          return (
            <div key={limit.name}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {limit.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {typeof limit.current === "number" ? limit.current.toLocaleString() : limit.current} / {typeof limit.max === "number" ? limit.max.toLocaleString() : limit.max}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isNearLimit
                      ? "bg-gradient-to-r from-amber-400 to-amber-600"
                      : "bg-gradient-to-r from-green-400 to-green-600"
                  }`}
                  style={{ width: `${limit.percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {limit.percentage}% used
                {isNearLimit && (
                  <span className="ml-2 font-semibold text-amber-600 dark:text-amber-400">
                    • Near limit
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
