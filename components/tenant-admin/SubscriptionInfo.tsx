"use client";

import { useState } from "react";
import { CreditCard, Calendar, TrendingUp, Loader2 } from "lucide-react";
import type { MySubscriptionResponse } from "@/lib/api/subscription";
import { cancelSubscription, toggleAutoRenew } from "@/lib/api/subscription";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface SubscriptionInfoProps {
  subscription: MySubscriptionResponse | null;
  loading?: boolean;
  onUpdated?: () => void;
}

const tierNameVi: Record<string, string> = {
  STARTER: "Khởi đầu",
  STANDARD: "Tiêu chuẩn",
  ENTERPRISE: "Doanh nghiệp",
  TRIAL: "Dùng thử",
};
const tierNameEn: Record<string, string> = {
  STARTER: "Starter",
  STANDARD: "Standard",
  ENTERPRISE: "Enterprise",
  TRIAL: "Trial",
};

export function SubscriptionInfo({
  subscription,
  loading,
  onUpdated,
}: SubscriptionInfoProps) {
  const [cancelLoading, setCancelLoading] = useState(false);
  const [autoRenewLoading, setAutoRenewLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setCancelLoading(true);
    try {
      await cancelSubscription(cancelReason.trim());
      setShowCancelForm(false);
      setCancelReason("");
      onUpdated?.();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Hủy gói thất bại");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleToggleAutoRenew = async () => {
    if (!subscription) return;
    const next = !subscription.autoRenew;
    setAutoRenewLoading(true);
    try {
      await toggleAutoRenew(next);
      onUpdated?.();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Cập nhật thất bại");
    } finally {
      setAutoRenewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-8 shadow-lg dark:bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-green-500" />
        <span className="text-sm text-zinc-500">{t.loading}…</span>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-3xl bg-linear-to-br from-green-50 to-emerald-50 p-8 shadow-lg dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20">
            <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t.currentPlan}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.noPlanYet}</p>
          </div>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.selectPlanInTab}</p>
      </div>
    );
  }

  const tierMap = language === "vi" ? tierNameVi : tierNameEn;
  const tier = tierMap[subscription.tier] ?? subscription.tier;
  const nextDate = subscription.nextBillingDate || subscription.endDate;
  const isCancelled = !!subscription.cancelledAt;

  return (
    <div className="rounded-3xl bg-linear-to-br from-green-50 to-emerald-50 p-8 shadow-lg shadow-green-100/60 dark:from-zinc-950 dark:to-zinc-900 dark:shadow-black/40">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20">
          <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{t.currentPlan}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.currentPlanDescription}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-white/60 p-6 dark:bg-zinc-800/40">
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-zinc-900 dark:text-white">{tier}</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              subscription.status === "ACTIVE" && !isCancelled
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {subscription.status === "ACTIVE"
              ? isCancelled
                ? "Đã hủy (còn hiệu lực đến hết kỳ)"
                : t.active
              : subscription.status}
          </span>
        </div>
        <p className="text-2xl font-bold text-zinc-900 dark:text-white">
          {subscription.price != null
            ? `${subscription.price.toLocaleString("vi-VN")}${subscription.currency === "VND" ? "đ" : subscription.currency || ""}`
            : "—"}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            /{subscription.billingCycle === "YEARLY" ? "năm" : subscription.billingCycle === "QUARTERLY" ? "quý" : "tháng"}
          </span>
        </p>
      </div>

      <div className="space-y-3">
        {nextDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Calendar className="h-4 w-4" />
              {t.renewalDate}
            </span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {new Date(nextDate).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
            </span>
          </div>
        )}
        {!subscription.isTrial && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <TrendingUp className="h-4 w-4" />
              {t.autoRenew}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-white">
                {subscription.autoRenew ? t.on : t.off}
              </span>
              <button
                type="button"
                disabled={autoRenewLoading || isCancelled}
                onClick={handleToggleAutoRenew}
                className="rounded-lg bg-green-500/20 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-500/30 dark:text-green-400 disabled:opacity-50"
              >
                {autoRenewLoading ? <Loader2 className="h-3 w-3 animate-spin inline" /> : subscription.autoRenew ? t.off : t.on}
              </button>
            </div>
          </div>
        )}
      </div>

      {!subscription.isTrial && subscription.status === "ACTIVE" && !isCancelled && (
        <div className="mt-6">
          {!showCancelForm ? (
            <button
              type="button"
              onClick={() => setShowCancelForm(true)}
              className="rounded-2xl border border-red-200 bg-white px-4 py-3 font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              {t.cancelPlan}
            </button>
          ) : (
            <div className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.cancelReason}
              </label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder={t.enterReason}
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={cancelLoading}
                  onClick={handleCancel}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : t.confirmCancel}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCancelForm(false); setCancelReason(""); }}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
