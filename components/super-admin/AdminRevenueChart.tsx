"use client";

import { useEffect, useMemo, useState } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { fetchAdminRevenue, type RevenueSeriesItem } from "@/lib/api/admin-analytics";

/**
 * Doanh thu theo tháng — chờ API revenue time-series từ BE.
 */
export function AdminRevenueChart() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("VND");
  const [series, setSeries] = useState<RevenueSeriesItem[]>([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    averagePerBucket: 0,
    peakRevenue: 0,
    peakPeriod: "",
  });
  const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const normalizeMonthYear = (row: RevenueSeriesItem): { month: number; year: number } | null => {
    const rawMonth = row.month;
    if (typeof rawMonth === "number" && Number.isFinite(rawMonth) && rawMonth >= 1 && rawMonth <= 12) {
      const m = Number(rawMonth);
      const periodMatch = String(row.period || row.label || "").match(/(\d{4})-(\d{1,2})/);
      const y = periodMatch ? Number(periodMatch[1]) : new Date().getFullYear();
      return { month: m, year: y };
    }

    const source = String(rawMonth ?? row.period ?? row.label ?? "");
    const m = source.match(/(\d{4})-(\d{1,2})/);
    if (m) {
      const year = Number(m[1]);
      const month = Number(m[2]);
      if (Number.isFinite(year) && Number.isFinite(month) && month >= 1 && month <= 12) {
        return { month, year };
      }
    }
    return null;
  };

  const formatBucketLabel = (row: RevenueSeriesItem) => {
    const parsed = normalizeMonthYear(row);
    if (!parsed) return row.period || row.label || "—";
    if (isEn) return `${monthNamesEn[parsed.month - 1]}-${parsed.year}`;
    return `T${parsed.month}-${parsed.year}`;
  };

  const formatMoney = (v: number) => {
    const amount = Number.isFinite(v) ? v : 0;
    return `${amount.toLocaleString(isEn ? "en-US" : "vi-VN", {
      maximumFractionDigits: 0,
    })} đ`;
  };

  const formatPeakPeriod = (raw: string) => {
    if (!raw?.trim()) return "—";
    const m = raw.match(/(\d{4})-(\d{1,2})/);
    if (!m) return raw;
    const year = m[1];
    const monthNum = Number(m[2]);
    if (!(monthNum >= 1 && monthNum <= 12)) return raw;
    if (!isEn) return `T${monthNum}-${year}`;
    return `${monthNamesEn[monthNum - 1]}-${year}`;
  };

  const load = () => {
    setLoading(true);
    setError(null);
    void fetchAdminRevenue({ bucket: "month", timezone: "UTC", currency: "VND" })
      .then(({ ok, status, data }) => {
        setStatus(status);
        if (!ok || !data) {
          if (status === 401) {
            setError(isEn ? "Session expired. Please login again." : "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          } else if (status === 403) {
            setError(isEn ? "No permission to view revenue." : "Bạn không có quyền xem doanh thu.");
          } else if (status >= 500) {
            setError(isEn ? "Server error. Please retry." : "Lỗi máy chủ. Vui lòng thử lại.");
          } else {
            setError(isEn ? "Cannot load revenue data." : "Không tải được dữ liệu doanh thu.");
          }
          setSeries([]);
          return;
        }
        setCurrency((data.currency || "VND").toUpperCase());
        setSeries(Array.isArray(data.series) ? data.series : []);
        setSummary({
          totalRevenue: Number(data.summary?.totalRevenue ?? 0),
          averagePerBucket: Number(data.summary?.averagePerBucket ?? 0),
          peakRevenue: Number(data.summary?.peakRevenue ?? 0),
          peakPeriod: String(data.summary?.peakPeriod ?? ""),
        });
      })
      .catch(() => {
        setError(isEn ? "Cannot load revenue data." : "Không tải được dữ liệu doanh thu.");
        setSeries([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [isEn]);

  const maxValue = useMemo(() => Math.max(...series.map((d) => Number(d.revenue || 0)), 1), [series]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 p-8 shadow-lg shadow-amber-100/60 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-black/40">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20">
              <DollarSign className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {isEn ? "Revenue" : "Doanh thu"}
            </h3>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            {isEn ? `Monthly revenue (${currency})` : `Doanh thu theo tháng (${currency})`}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-amber-500/15 px-4 py-2">
          <TrendingUp className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
            {loading ? (isEn ? "Loading" : "Đang tải") : isEn ? "Live" : "Dữ liệu thật"}
          </span>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm dark:border-red-900/50 dark:bg-red-950/30">
          <p className="font-medium text-red-700 dark:text-red-200">{error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            {isEn ? "Retry" : "Thử lại"}
          </button>
        </div>
      ) : null}

      <div className="mb-8 flex min-h-[140px] items-end justify-between gap-2">
        {loading
          ? [1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="flex flex-1 flex-col items-center gap-2">
                <div className="h-[56px] w-full rounded-t-xl bg-amber-200/70 dark:bg-zinc-800" />
                <p className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">—</p>
              </div>
            ))
          : series.map((row, index) => {
              const value = Number(row.revenue ?? 0);
              const h = maxValue > 0 ? (value / maxValue) * 100 : 0;
              return (
                <div key={`${row.period}-${index}`} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex-1">
                    <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
                      {formatMoney(value)}
                    </div>
                    <div
                      className="w-full min-h-[12px] rounded-t-xl bg-gradient-to-t from-amber-400 via-orange-500 to-rose-600 shadow-lg shadow-amber-500/20 transition group-hover:shadow-amber-500/40"
                      style={{ height: `${Math.max(h * 1.2, value === 0 ? 12 : 40)}px` }}
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">{formatBucketLabel(row)}</p>
                </div>
              );
            })}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-white/95 p-4 ring-1 ring-amber-200/70 dark:bg-zinc-800/40 dark:ring-0 sm:grid-cols-4">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase text-zinc-600">{isEn ? "Total" : "Tổng"}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-white">{loading ? "—" : formatMoney(summary.totalRevenue)}</p>
        </div>
        <div className="text-center sm:border-l sm:border-zinc-200 dark:sm:border-zinc-700">
          <p className="text-[10px] font-bold uppercase text-zinc-600">{isEn ? "Avg / bucket" : "TB / kỳ"}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-white">{loading ? "—" : formatMoney(Math.round(summary.averagePerBucket))}</p>
        </div>
        <div className="text-center sm:border-l sm:border-zinc-200 dark:sm:border-zinc-700">
          <p className="text-[10px] font-bold uppercase text-zinc-600">{isEn ? "Peak" : "Cao nhất"}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-white">{loading ? "—" : formatMoney(summary.peakRevenue)}</p>
        </div>
        <div className="text-center sm:border-l sm:border-zinc-200 dark:sm:border-zinc-700">
          <p className="text-[10px] font-bold uppercase text-zinc-600">{isEn ? "Peak period" : "Kỳ cao nhất"}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-zinc-900 dark:text-white">
            {loading ? "—" : formatPeakPeriod(summary.peakPeriod)}
          </p>
        </div>
      </div>

      {/* Revenue notes removed by request */}
    </div>
  );
}
