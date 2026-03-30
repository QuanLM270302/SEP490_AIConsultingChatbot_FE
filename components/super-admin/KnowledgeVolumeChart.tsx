"use client";

import { Database, FileText } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { useSuperAdminDashboardAnalytics } from "@/components/super-admin/SuperAdminDashboardAnalyticsContext";
import { formatCompactInt } from "@/components/super-admin/dashboard-chart-utils";

/** Tài liệu & chunk index (tách khỏi subscription). */
export function KnowledgeVolumeChart() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const { parsed, loading } = useSuperAdminDashboardAnalytics();
  const doc = parsed.documents.totalDocuments;
  const chunks = parsed.documents.totalChunks;

  const bars = [
    {
      key: "doc",
      label: isEn ? "Documents" : "Tài liệu",
      value: doc,
      icon: FileText,
      hint: isEn ? "Files" : "Tệp",
    },
    {
      key: "chunk",
      label: isEn ? "Chunks" : "Chunk",
      value: chunks,
      icon: Database,
      hint: isEn ? "Indexed chunks" : "Chunk đã lập chỉ mục",
    },
  ];

  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:ring-zinc-800 dark:shadow-black/40">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20">
            <Database className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {isEn ? "Knowledge base" : "Tri thức (KB)"}
          </h3>
        </div>
        <p className="text-sm text-zinc-700 dark:text-zinc-400">
          {isEn ? "Document files and indexed chunks platform-wide" : "Tệp tài liệu và chunk index toàn hệ thống"}
        </p>
      </div>

      <div className="flex flex-1 items-end">
        <div className="flex min-h-[240px] w-full items-end justify-between gap-4">
        {bars.map((data, index) => {
          const heightPercentage = loading ? 8 : (data.value / maxValue) * 100;
          const Icon = data.icon;
          const minH = data.value === 0 ? 6 : 36;
          return (
            <div key={data.key} className="group flex flex-1 flex-col items-center gap-3">
              <div className="relative w-full">
                <div
                  className="flex w-full min-h-[36px] items-end justify-center rounded-t-xl bg-gradient-to-t from-cyan-400 via-teal-500 to-emerald-600 shadow-lg shadow-teal-500/25 transition-all duration-700 ease-out group-hover:shadow-teal-500/45"
                  style={{
                    height: `${Math.max(heightPercentage * 1.2, minH)}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                    {loading ? "—" : formatCompactInt(data.value)}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Icon className="mx-auto mb-1 h-4 w-4 text-teal-600 dark:text-teal-400" />
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{data.label}</p>
                <p className="mt-0.5 text-[10px] text-zinc-500">{data.hint}</p>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6 rounded-2xl bg-zinc-100/95 p-5 ring-1 ring-zinc-200/80 dark:bg-zinc-800/40 dark:ring-0">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {isEn ? "Documents" : "Tài liệu"}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {loading ? "—" : doc.toLocaleString()}
          </p>
        </div>
        <div className="border-l border-zinc-200 text-center dark:border-zinc-700">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {isEn ? "Chunks" : "Chunk"}
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {loading ? "—" : formatCompactInt(chunks)}
          </p>
        </div>
      </div>
    </div>
  );
}
