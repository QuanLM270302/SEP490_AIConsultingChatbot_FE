"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2 } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import {
  getAdminSubscriptions,
  getSubscriptionPlans,
  type AdminSubscriptionResponse,
  type SubscriptionPlanResponse,
} from "@/lib/api/admin";

/** Tên gói chỉ theo ngôn ngữ: EN = bản tiếng Anh chuẩn; VI = tên từ API hoặc bản rút gọn. */
function chartPlanLabel(
  plan: SubscriptionPlanResponse | undefined,
  code: string,
  isEn: boolean
): string {
  const c = code.toUpperCase();
  const enMap: Record<string, string> = {
    TRIAL: "Trial",
    STARTER: "Starter",
    STANDARD: "Standard",
    ENTERPRISE: "Enterprise",
  };
  const viMap: Record<string, string> = {
    TRIAL: "Dùng thử",
    STARTER: "Khởi đầu",
    STANDARD: "Tiêu chuẩn",
    ENTERPRISE: "Doanh nghiệp",
  };
  if (isEn) {
    return enMap[c] || c;
  }
  return plan?.name?.trim() || viMap[c] || c;
}

function resolveSubscriptionPlanId(
  s: AdminSubscriptionResponse,
  plans: SubscriptionPlanResponse[]
): string {
  const raw = s as Record<string, unknown>;
  const pid = raw["subscriptionPlanId"] ?? raw["planId"];
  if (typeof pid === "string" && plans.some((p) => p.id === pid)) return pid;
  const t = (s.tier ?? "").toUpperCase().trim();
  if (t) {
    const byCode = plans.find((p) => (p.code ?? "").toUpperCase().trim() === t);
    if (byCode) return byCode.id;
  }
  return "__other__";
}

function isActiveStatus(status: string | undefined): boolean {
  const u = (status ?? "").toUpperCase().trim();
  return u === "ACTIVE" || u === "TRIAL";
}

/** Bảng subscription theo từng plan (dữ liệu từ API admin). */
export function PlatformSubscriptionsChart() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [subs, setSubs] = useState<AdminSubscriptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([getSubscriptionPlans(), getAdminSubscriptions()])
      .then(([p, s]) => {
        setPlans(p);
        setSubs(s);
      })
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : language === "en" ? "Failed to load" : "Không tải được"
        )
      )
      .finally(() => setLoading(false));
  }, [language]);

  useEffect(() => {
    load();
  }, [load]);

  const sortedPlans = [...plans].sort((a, b) => {
    const oa = a.displayOrder ?? 999;
    const ob = b.displayOrder ?? 999;
    if (oa !== ob) return oa - ob;
    return chartPlanLabel(a, (a.code ?? "").toUpperCase(), isEn).localeCompare(
      chartPlanLabel(b, (b.code ?? "").toUpperCase(), isEn)
    );
  });

  const stats = new Map<string, { total: number; active: number }>();
  sortedPlans.forEach((p) => stats.set(p.id, { total: 0, active: 0 }));
  stats.set("__other__", { total: 0, active: 0 });

  subs.forEach((s) => {
    const id = resolveSubscriptionPlanId(s, sortedPlans);
    const row = stats.get(id);
    if (!row) return;
    row.total += 1;
    if (isActiveStatus(s.status)) row.active += 1;
  });

  const totalSubs = subs.length;
  const totalActive = subs.filter((s) => isActiveStatus(s.status)).length;
  const planCodeOrder = ["TRIAL", "STARTER", "STANDARD", "ENTERPRISE"];
  const chartRows = planCodeOrder.map((code) => {
    const plan = sortedPlans.find((p) => (p.code ?? "").toUpperCase() === code);
    const id = plan?.id ?? code;
    const active = plan ? (stats.get(plan.id)?.active ?? 0) : 0;
    return {
      id,
      label: chartPlanLabel(plan, code, isEn),
      active,
    };
  });
  const maxActive = Math.max(...chartRows.map((r) => r.active), 1);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-6 shadow-lg shadow-blue-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {isEn ? "Subscriptions by plan" : "Đăng ký theo gói"}
            </h3>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-400">
            {isEn
              ? "Tenant subscriptions grouped by subscription plan"
              : "Số subscription của tenant theo từng gói"}
          </p>
        </div>
        <Link
          href="/super-admin/subscriptions"
          className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
        >
          {isEn ? "Open full list →" : "Xem danh sách đầy đủ →"}
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-zinc-300/90 bg-white/95 p-4 dark:border-zinc-800 dark:bg-zinc-950/60 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>{isEn ? "Active subscriptions" : "Subscription đang hoạt động"}</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-4 items-end gap-2 pt-4 sm:gap-4">
            {chartRows.map((row) => {
              const activePct = (row.active / maxActive) * 100;
              return (
                <div key={row.id} className="group flex min-w-0 flex-col items-center gap-2">
                  <div className="relative flex h-44 w-full items-end justify-center">
                    <div
                      className="w-8 rounded-t-lg bg-emerald-500/80 transition-all group-hover:bg-emerald-500 sm:w-10"
                      style={{ height: `${Math.max(activePct * 1.2, row.active === 0 ? 6 : 16)}px` }}
                    />
                  </div>
                  <p className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-zinc-800 dark:text-zinc-200 sm:text-xs">
                    {row.label}
                  </p>
                  <p className="text-[11px] tabular-nums text-zinc-700 dark:text-zinc-300">{row.active}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!loading && (
        <div className="mt-4 rounded-2xl bg-white/90 p-4 text-center ring-1 ring-blue-200/70 dark:ring-0 dark:bg-zinc-900/50">
          <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-600">
            {isEn ? "Active total" : "Tổng active"}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
            {totalActive}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {isEn ? `All subscriptions: ${totalSubs}` : `Tất cả subscription: ${totalSubs}`}
          </p>
        </div>
      )}
    </div>
  );
}
