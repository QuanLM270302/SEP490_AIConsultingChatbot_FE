"use client";

import { Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { useSuperAdminDashboardAnalytics } from "@/components/super-admin/SuperAdminDashboardAnalyticsContext";
import {
  formatCheckedAt,
  formatUptimeSeconds,
} from "@/components/super-admin/dashboard-chart-utils";

/**
 * Trạng thái `system` từ analytics (STABLE/DEGRADED + uptime nếu có).
 */
export function SystemHealth() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const t = translations[language];
  const { parsed, loading } = useSuperAdminDashboardAnalytics();
  const { system, systemStatus } = parsed;

  const isOk = systemStatus === "Healthy";
  const label =
    systemStatus === "Healthy"
      ? t.healthy
      : systemStatus === "Unhealthy"
        ? t.unhealthy
        : (system.statusLabel || parsed.systemStatusLabelRaw || "—").trim() || t.unknown;

  const services: {
    id: "platform" | "uptime" | "checked";
    name: string;
    status: "operational" | "degraded";
    detail: string;
  }[] = [
    {
      id: "platform",
      name: isEn ? "Platform (API status)" : "Nền tảng (API)",
      status: isOk ? "operational" : "degraded",
      detail: loading ? "—" : label,
    },
    {
      id: "uptime",
      name: isEn ? "App uptime" : "Thời gian chạy",
      status: "operational",
      detail: loading ? "—" : formatUptimeSeconds(system.appUptimeSeconds),
    },
    {
      id: "checked",
      name: isEn ? "Last checked" : "Kiểm tra lần cuối",
      status: "operational",
      detail: loading ? "—" : formatCheckedAt(system.checkedAt),
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {isEn ? "System health" : "Sức khỏe hệ thống"}
      </h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {isEn ? "From analytics `system` object" : "Từ object `system` trong analytics"}
      </p>

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-2xl bg-zinc-100/95 p-4 ring-1 ring-zinc-200/80 dark:bg-zinc-900 dark:ring-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  service.status === "operational" ? "bg-green-500/10" : "bg-amber-500/10"
                }`}
              >
                {service.id === "uptime" ? (
                  <Activity className="h-4 w-4 text-green-500" />
                ) : service.id === "checked" ? (
                  <Clock className="h-4 w-4 text-green-500" />
                ) : service.status === "operational" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{service.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{service.detail}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {service.status === "operational"
                  ? isEn
                    ? "OK"
                    : "Ổn"
                  : isEn
                    ? "Warn"
                    : "Cảnh báo"}
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {isEn ? "Status" : "Trạng thái"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
