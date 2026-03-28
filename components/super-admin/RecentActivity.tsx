"use client";

import { useEffect, useState } from "react";
import { Building2, Clock, Shield, UserPlus } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { fetchAdminRecentActivities, type RecentActivityItem } from "@/lib/api/admin-analytics";

function toRelativeTime(iso: string, isEn: boolean): string {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  const diffSec = Math.max(0, Math.floor((Date.now() - dt.getTime()) / 1000));
  if (diffSec < 60) return isEn ? "just now" : "vừa xong";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return isEn ? `${mins} minutes ago` : `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return isEn ? `${hrs} hours ago` : `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return isEn ? `${days} days ago` : `${days} ngày trước`;
}

function itemIcon(type: string) {
  const t = type.toUpperCase();
  if (t.includes("TENANT")) return Building2;
  if (t.includes("USER")) return UserPlus;
  if (t.includes("SECURITY")) return Shield;
  return Clock;
}

function severityClasses(severity: string) {
  const s = severity.toLowerCase();
  if (s === "error") return { bg: "bg-red-500/10", icon: "text-red-500" };
  if (s === "warning") return { bg: "bg-amber-500/10", icon: "text-amber-500" };
  return { bg: "bg-green-500/10", icon: "text-green-500" };
}

export function RecentActivity() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const [items, setItems] = useState<RecentActivityItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = (cursor?: string) => {
    if (cursor) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    void fetchAdminRecentActivities({ limit: 20, cursor })
      .then(({ ok, status, data }) => {
        if (!ok || !data) {
          if (status === 401) setError(isEn ? "Session expired. Please login again." : "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          else if (status === 403) setError(isEn ? "No permission to view activities." : "Bạn không có quyền xem hoạt động.");
          else if (status >= 500) setError(isEn ? "Server error. Please retry." : "Lỗi máy chủ. Vui lòng thử lại.");
          else setError(isEn ? "Cannot load activities." : "Không tải được hoạt động.");
          return;
        }
        const list = Array.isArray(data.items) ? data.items : [];
        setItems((prev) => (cursor ? [...prev, ...list] : list));
        setNextCursor(data.nextCursor ?? null);
      })
      .catch(() => setError(isEn ? "Cannot load activities." : "Không tải được hoạt động."))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    load();
  }, [isEn]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {isEn ? "Recent Activity" : "Hoạt động gần đây"}
      </h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {isEn
          ? "Latest events and changes from analytics activity feed"
          : "Các sự kiện và thay đổi mới nhất từ activity feed"}
      </p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm dark:border-red-900/50 dark:bg-red-950/30">
          <p className="font-medium text-red-700 dark:text-red-200">{error}</p>
          <button type="button" onClick={() => load()} className="mt-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
            {isEn ? "Retry" : "Thử lại"}
          </button>
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {error ? null : loading ? (
          <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-zinc-100/95 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{isEn ? "Loading activities..." : "Đang tải hoạt động..."}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-zinc-100/95 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{isEn ? "No recent activities." : "Chưa có hoạt động gần đây."}</p>
          </div>
        ) : (
          items.map((activity) => {
            const Icon = itemIcon(activity.type);
            const color = severityClasses(activity.severity);
            return (
              <div key={activity.id} className="flex items-start gap-3 rounded-2xl bg-zinc-100/95 p-4 ring-1 ring-zinc-200/80 dark:bg-zinc-900 dark:ring-0">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color.bg}`}>
                  <Icon className={`h-4 w-4 ${color.icon}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{activity.message}</p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {activity.type}
                    {activity.actor?.name ? ` • ${activity.actor.name}` : ""}
                    {activity.target?.name ? ` • ${activity.target.name}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">{toRelativeTime(activity.occurredAt, isEn)}</span>
              </div>
            );
          })
        )}
      </div>

      {!loading && nextCursor ? (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => load(nextCursor)}
            disabled={loadingMore}
            className="rounded-xl bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-300 disabled:opacity-60 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            {loadingMore ? (isEn ? "Loading..." : "Đang tải...") : isEn ? "Load more" : "Tải thêm"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
