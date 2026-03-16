"use client";

import { FileText, Upload, Eye, TrendingUp } from "lucide-react";

const stats = [
  {
    name: "Total Documents",
    value: "480",
    change: "+24 this month",
    icon: FileText,
  },
  {
    name: "Uploaded Today",
    value: "12",
    change: "+3 from yesterday",
    icon: Upload,
  },
  {
    name: "Most Referenced",
    value: "HR Policy",
    change: "324 queries",
    icon: Eye,
  },
  {
    name: "Storage Used",
    value: "2.3GB",
    change: "23% of 10GB",
    icon: TrendingUp,
  },
];

export function DocumentStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="rounded-3xl bg-white p-5 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-400">
                  {stat.name}
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {stat.change}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10">
                <Icon className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
