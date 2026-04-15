"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { SubscriptionTabs } from "@/components/subscription/SubscriptionTabs";
import { SubscriptionInfo } from "@/components/tenant-admin/SubscriptionInfo";
import { BillingHistory } from "@/components/tenant-admin/BillingHistory";
import {
  getAvailableSubscriptionPlans,
  getMySubscription,
  selectPlan,
} from "@/lib/api/subscription";
import { getPaymentHistory, getPaymentStatus } from "@/lib/api/payment";
import { Be_Vietnam_Pro } from "next/font/google";
import type {
  BillingCycle,
  MySubscriptionResponse,
  SelectPlanResponse,
  SubscriptionTier,
  TenantSubscriptionPlanResponse,
} from "@/lib/api/subscription";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

type TabId = "plans" | "billing" | "history";

const TIER_LABEL_VI: Record<SubscriptionTier, string> = {
  TRIAL: "Dùng thử",
  STARTER: "Khởi đầu",
  STANDARD: "Tiêu chuẩn",
  ENTERPRISE: "Doanh nghiệp",
};
const TIER_LABEL_EN: Record<SubscriptionTier, string> = {
  TRIAL: "Trial",
  STARTER: "Starter",
  STANDARD: "Standard",
  ENTERPRISE: "Enterprise",
};

const TIER_ORDER: SubscriptionTier[] = ["TRIAL", "STARTER", "STANDARD", "ENTERPRISE"];
const FALLBACK_PLAN_CARDS: SubscriptionTier[] = ["STARTER", "STANDARD", "ENTERPRISE"];

const PLAN_FEATURES_VI: Record<SubscriptionTier, string[]> = {
  TRIAL: [
    "Dùng thử miễn phí 14 ngày",
    "Đủ chức năng để trải nghiệm chatbot nội bộ",
    "Không tự động gia hạn",
  ],
  STARTER: [
    "Phù hợp nhóm nhỏ bắt đầu triển khai AI nội bộ",
    "Quản lý tài liệu và truy vấn chatbot cơ bản",
    "Chi phí tối ưu cho giai đoạn khởi động",
  ],
  STANDARD: [
    "Tối ưu cho doanh nghiệp đang mở rộng",
    "Hiệu năng tốt hơn cho tần suất hỏi đáp cao",
    "Cân bằng giữa chi phí và năng lực vận hành",
  ],
  ENTERPRISE: [
    "Dành cho tổ chức lớn, yêu cầu cao",
    "Ưu tiên khả năng mở rộng và mức sử dụng lớn",
    "Phù hợp triển khai toàn diện nhiều phòng ban",
  ],
};

const PLAN_FEATURES_EN: Record<SubscriptionTier, string[]> = {
  TRIAL: [
    "Free for a 14-day trial",
    "Enough features to experience internal chatbot usage",
    "No auto-renewal",
  ],
  STARTER: [
    "Best for small teams starting with internal AI",
    "Core document management and chatbot usage",
    "Cost-efficient for early rollout",
  ],
  STANDARD: [
    "Ideal for growing organizations",
    "Better capacity for frequent chatbot interactions",
    "Balanced cost and operational capability",
  ],
  ENTERPRISE: [
    "Built for large organizations with high demand",
    "Prioritizes scale and higher usage limits",
    "Great for company-wide multi-department rollout",
  ],
};

const POPULAR_TIER: SubscriptionTier = "STANDARD";

const pricingFont = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

function tierDisplayName(tier: SubscriptionTier, lang: "vi" | "en"): string {
  return lang === "vi" ? TIER_LABEL_VI[tier] : TIER_LABEL_EN[tier];
}

function isTierCode(value: string | undefined): value is SubscriptionTier {
  return !!value && TIER_ORDER.includes(value as SubscriptionTier);
}

function parsePlanFeatures(features: string | undefined): string[] {
  if (!features) return [];
  if (features.includes("✅")) {
    return features
      .split("✅")
      .map((item) => item.replace(/^[\s\-•,]+/, "").trim())
      .filter(Boolean);
  }
  return features
    .split(/\r?\n|;/)
    .map((item) => item.replace(/^[\s\-•,]+/, "").trim())
    .filter(Boolean);
}

function formatTierPrice(
  plan: TenantSubscriptionPlanResponse | undefined,
  cycle: BillingCycle,
  lang: "vi" | "en"
): string {
  if (!plan) return "—";

  const raw =
    cycle === "YEARLY"
      ? plan.yearlyPrice
      : cycle === "QUARTERLY"
        ? plan.quarterlyPrice
        : plan.monthlyPrice;

  if (raw == null) return "—";
  const amount = Number(raw);
  if (!Number.isFinite(amount)) return "—";
  if (amount === 0) return lang === "en" ? "Free" : "Miễn phí";

  const locale = lang === "en" ? "en-US" : "vi-VN";
  const currency = plan.currency ?? "VND";
  return currency === "VND"
    ? `${amount.toLocaleString(locale)}đ`
    : `${amount.toLocaleString(locale)} ${currency}`;
}

function getTierAmount(
  plan: TenantSubscriptionPlanResponse | undefined,
  cycle: BillingCycle
): number | null {
  if (!plan) return null;
  const raw =
    cycle === "YEARLY"
      ? plan.yearlyPrice
      : cycle === "QUARTERLY"
        ? plan.quarterlyPrice
        : plan.monthlyPrice;
  if (raw == null) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function formatAmount(
  amount: number | null,
  currency: string | undefined,
  lang: "vi" | "en"
): string {
  if (amount == null) return "—";
  if (amount === 0) return lang === "en" ? "Free" : "Miễn phí";
  const locale = lang === "en" ? "en-US" : "vi-VN";
  const unit = currency ?? "VND";
  return unit === "VND"
    ? `${amount.toLocaleString(locale)}đ`
    : `${amount.toLocaleString(locale)} ${unit}`;
}

export default function TenantAdminSubscriptionPage() {
  const [activeTab, setActiveTab] = useState<TabId>("plans");
  const [subscription, setSubscription] = useState<MySubscriptionResponse | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [availablePlans, setAvailablePlans] = useState<TenantSubscriptionPlanResponse[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Awaited<ReturnType<typeof getPaymentHistory>>>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [pressedTier, setPressedTier] = useState<SubscriptionTier | null>(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalTier, setPlanModalTier] = useState<SubscriptionTier | null>(null);
  const [modalBillingCycle, setModalBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [paymentPending, setPaymentPending] = useState<SelectPlanResponse | null>(null);
  const [selectPlanLoading, setSelectPlanLoading] = useState(false);
  const [selectPlanError, setSelectPlanError] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const t = translations[language];

  const loadSubscription = useCallback((options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (!silent) {
      setSubscriptionLoading(true);
    }
    getMySubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null)) // 404 or error = no subscription
      .finally(() => {
        if (!silent) {
          setSubscriptionLoading(false);
        }
      });
  }, []);

  const loadPayments = useCallback(() => {
    setPaymentsLoading(true);
    getPaymentHistory()
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setPaymentsLoading(false));
  }, []);

  const loadAvailablePlans = useCallback(() => {
    setPlansLoading(true);
    setPlansError(null);
    getAvailableSubscriptionPlans()
      .then(setAvailablePlans)
      .catch((e) => {
        setAvailablePlans([]);
        setPlansError(
          e instanceof Error
            ? e.message
            : language === "en"
              ? "Failed to load available plans"
              : "Không thể tải danh sách gói"
        );
      })
      .finally(() => setPlansLoading(false));
  }, [language]);

  const sortedPlans = useMemo(
    () =>
      [...availablePlans].sort((a, b) => {
        const orderA = a.displayOrder ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.displayOrder ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return (a.code ?? "").localeCompare(b.code ?? "");
      }),
    [availablePlans]
  );

  const planMap = useMemo(() => {
    const map = new Map<SubscriptionTier, TenantSubscriptionPlanResponse>();
    sortedPlans.forEach((plan) => {
      if (!isTierCode(plan.code) || map.has(plan.code)) return;
      map.set(plan.code, plan);
    });
    return map;
  }, [sortedPlans]);

  const planCards = useMemo<SubscriptionTier[]>(() => {
    const apiPlanCards = Array.from(planMap.keys());
    return apiPlanCards.length > 0 ? apiPlanCards : FALLBACK_PLAN_CARDS;
  }, [planMap]);

  const modalPlanData = planModalTier ? planMap.get(planModalTier) : undefined;
  const modalFeatures = useMemo(() => {
    if (!planModalTier) return [] as string[];
    const parsed = parsePlanFeatures(modalPlanData?.features);
    if (parsed.length > 0) return parsed;
    return language === "en" ? PLAN_FEATURES_EN[planModalTier] : PLAN_FEATURES_VI[planModalTier];
  }, [language, modalPlanData?.features, planModalTier]);
  const modalAmount = planModalTier === "TRIAL" ? 0 : getTierAmount(modalPlanData, modalBillingCycle);

  useEffect(() => {
    loadSubscription();
    loadAvailablePlans();
  }, [loadAvailablePlans, loadSubscription]);

  useEffect(() => {
    if (activeTab === "history") loadPayments();
  }, [activeTab, loadPayments]);

  const handleConfirmPay = async () => {
    setSelectPlanError(null);
    setSelectPlanLoading(true);
    try {
      if (!planModalTier) throw new Error("Chọn gói trước khi thanh toán");
      const data = await selectPlan(planModalTier, modalBillingCycle);
      if ("payment_id" in data && data.payment_id) {
        setPaymentPending(data);
      } else {
        handleSubscriptionUpdated();
        setPlanModalOpen(false);
        setPlanModalTier(null);
      }
    } catch (e) {
      setSelectPlanError(e instanceof Error ? e.message : "Chọn gói thất bại");
    } finally {
      setSelectPlanLoading(false);
    }
  };

  const handleSubscriptionUpdated = () => {
    loadSubscription();
    loadAvailablePlans();
    setPaymentPending(null);
    if (activeTab === "history") loadPayments();
  };

  const handleSubscriptionInfoUpdated = () => {
    loadSubscription({ silent: true });
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    setPressedTier(tier);
    setPlanModalTier(tier);
    setModalBillingCycle("MONTHLY");
    setPlanModalOpen(true);
    setPaymentPending(null);
    setSelectPlanError(null);
    window.setTimeout(() => {
      setPressedTier((current) => (current === tier ? null : current));
    }, 260);
  };

  const handleClosePlanModal = () => {
    if (selectPlanLoading) return;
    setPlanModalOpen(false);
    setPlanModalTier(null);
    setPaymentPending(null);
    setSelectPlanError(null);
  };

  return (
    <TenantAdminLayout>
      <div className="space-y-6 text-zinc-900 dark:text-zinc-100">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {t.tenantAdminSubscription}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {t.subscriptionPageDescription}
          </p>
        </div>

        <section className="mb-6">
          <SubscriptionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </section>

        {activeTab === "plans" && (
          <>
            <div className="mb-5">
              <SubscriptionInfo
                subscription={subscription}
                loading={subscriptionLoading}
                onUpdated={handleSubscriptionInfoUpdated}
              />
            </div>
            <div className={`${pricingFont.className} mb-5`}>
              <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {language === "en" ? "Select your plan" : "Chọn hạng gói phù hợp"}
              </h3>
              {plansLoading && (
                <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                  {language === "en" ? "Loading available plans..." : "Đang tải danh sách gói..."}
                </p>
              )}
              {plansError && (
                <p className="mb-3 text-xs text-red-600 dark:text-red-400">{plansError}</p>
              )}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                {planCards.map((tier) => {
                  const isPressing = pressedTier === tier;
                  const isPopular = tier === POPULAR_TIER;
                  const isCurrentPlan =
                    !!subscription &&
                    subscription.tier === tier &&
                    (subscription.status === "ACTIVE" || subscription.status === "TRIAL");
                  const planData = planMap.get(tier);
                  const apiFeatures = parsePlanFeatures(planData?.features);
                  const fallbackFeatures =
                    language === "en" ? PLAN_FEATURES_EN[tier] : PLAN_FEATURES_VI[tier];
                  const features = apiFeatures.length > 0 ? apiFeatures : fallbackFeatures;
                  const cycleLabel = language === "en" ? "month" : "tháng";
                  return (
                    <article
                      key={tier}
                      className={`relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border bg-[#111111] px-5 pb-5 text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isPopular
                          ? "z-10 border-2 border-[#f28b82]"
                          : "border-[#222222]"
                      } hover:-translate-y-1 hover:border-[#343434] ${isPressing ? "scale-[0.985]" : "scale-100"}`}
                    >
                      {isPopular && (
                        <>
                          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#f28b82]/14 via-transparent to-transparent" />
                          <div className="absolute inset-x-0 top-0 z-20">
                            <span className="block bg-[#f28b82] py-2 text-center text-xs font-bold uppercase tracking-wide text-black">
                              {language === "en" ? "Most Popular" : "Phổ biến nhất"}
                            </span>
                          </div>
                        </>
                      )}

                      {isCurrentPlan && (
                        <div className={`absolute right-3 z-20 ${isPopular ? "top-11" : "top-3"}`}>
                          <span className="inline-flex rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white">
                            {language === "en" ? "Current plan" : "Gói đang dùng"}
                          </span>
                        </div>
                      )}

                      <div className={`relative z-10 flex h-full flex-col ${isPopular ? "pt-12" : "pt-5"}`}>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                          {language === "en" ? "Plan" : "Hạng gói"}
                        </p>

                        <h4 className="mt-1 text-5xl leading-tight font-bold text-zinc-100">
                          {tierDisplayName(tier, language === "en" ? "en" : "vi")}
                        </h4>

                        {tier === "TRIAL" ? (
                          <>
                            <p className="mt-3 text-[3.05rem] leading-none font-extrabold text-zinc-50">
                              {language === "en" ? "Free" : "Miễn phí"}
                            </p>
                            <p className="mt-1 text-xs font-medium text-zinc-500">
                              {language === "en" ? "for 14 days" : "trong 14 ngày"}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-3 text-[3.05rem] leading-none font-extrabold text-zinc-50">
                              {formatTierPrice(planData, "MONTHLY", language === "en" ? "en" : "vi")}
                            </p>
                            <p className="mt-1 text-xs font-medium text-zinc-500">/{cycleLabel}</p>
                          </>
                        )}

                        {planData?.description ? (
                          <p className="mt-4 min-h-[48px] text-sm leading-relaxed text-zinc-400">
                            {planData.description}
                          </p>
                        ) : (
                          <div className="mt-4 min-h-[48px]" />
                        )}

                        <ul className="mt-6 flex-1 space-y-3 text-base text-zinc-200">
                          {features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <span className="mt-2 text-[10px] leading-none text-zinc-500">●</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6">
                          <button
                            type="button"
                            disabled={isCurrentPlan}
                            onClick={() => handleSelectTier(tier)}
                            className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
                              isCurrentPlan
                                ? "cursor-not-allowed border border-zinc-700 bg-[#1a1a1a] text-zinc-500"
                                : "bg-[#f28b82] text-black hover:opacity-95"
                            }`}
                          >
                            {isCurrentPlan
                              ? language === "en"
                                ? "Currently active"
                                : "Đang sử dụng"
                              : language === "en"
                                ? "Select this plan"
                                : "Chọn gói này"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {planModalOpen && planModalTier && (
              <PlanCheckoutModal
                language={language === "en" ? "en" : "vi"}
                tier={planModalTier}
                planData={modalPlanData}
                features={modalFeatures}
                billingCycle={modalBillingCycle}
                totalAmount={modalAmount}
                onBillingCycleChange={setModalBillingCycle}
                onClose={handleClosePlanModal}
                onConfirm={handleConfirmPay}
                confirmLoading={selectPlanLoading}
                confirmError={selectPlanError}
                paymentPending={paymentPending}
                onPaymentSuccess={() => {
                  handleSubscriptionUpdated();
                  setPlanModalOpen(false);
                  setPlanModalTier(null);
                }}
              />
            )}
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100">
              <p>
                Thay đổi gói đăng ký sẽ áp dụng cho toàn bộ nhân viên trong tổ chức. Hãy đảm bảo bạn đã trao đổi với các bên liên quan trước khi xác nhận nâng cấp hoặc hạ cấp gói.
              </p>
            </section>
          </>
        )}

        {activeTab === "billing" && (
          <section className="rounded-3xl border-2 border-zinc-200 bg-white p-8 text-sm text-zinc-700 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            <h2 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {t.billingInfo}
            </h2>
            <p>
              {t.billingInfoDescription}
            </p>
          </section>
        )}

        {activeTab === "history" && (
          <BillingHistory payments={payments} loading={paymentsLoading} />
        )}
      </div>
    </TenantAdminLayout>
  );
}

function PlanCheckoutModal({
  language,
  tier,
  planData,
  features,
  billingCycle,
  totalAmount,
  onBillingCycleChange,
  onClose,
  onConfirm,
  confirmLoading,
  confirmError,
  paymentPending,
  onPaymentSuccess,
}: {
  language: "vi" | "en";
  tier: SubscriptionTier;
  planData: TenantSubscriptionPlanResponse | undefined;
  features: string[];
  billingCycle: BillingCycle;
  totalAmount: number | null;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  confirmLoading: boolean;
  confirmError: string | null;
  paymentPending: SelectPlanResponse | null;
  onPaymentSuccess: () => void;
}) {
  const isTrial = tier === "TRIAL";
  const [entered, setEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleStartClose = useCallback(() => {
    if (isClosing || confirmLoading) return;
    setIsClosing(true);
    window.setTimeout(() => {
      onClose();
    }, 220);
  }, [confirmLoading, isClosing, onClose]);

  const modalVisible = entered && !isClosing;

  const cycleText =
    billingCycle === "YEARLY"
      ? language === "en"
        ? "year"
        : "năm"
      : billingCycle === "QUARTERLY"
        ? language === "en"
          ? "quarter"
          : "quý"
        : language === "en"
          ? "month"
          : "tháng";

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-200 ${
        modalVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`${pricingFont.className} max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl border border-zinc-700 bg-zinc-950 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          modalVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === "en" ? "Confirm Subscription Plan" : "Xác nhận gói đăng ký"}
            </h3>
            <p className="text-xs text-zinc-400">
              {language === "en"
                ? "Review plan details and payment before creating transaction"
                : "Xem lại thông tin gói và thanh toán trước khi tạo giao dịch"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartClose}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            {language === "en" ? "Close" : "Đóng"}
          </button>
        </div>

        {paymentPending ? (
          <div className="p-6">
            <PaymentPendingSection
              data={paymentPending}
              language={language}
              onClose={handleStartClose}
              onSuccess={onPaymentSuccess}
              compact
            />
          </div>
        ) : (
          <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 text-zinc-100">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {language === "en" ? "Plan" : "Hạng gói"}
              </p>
              <h4 className="mt-1 text-4xl font-bold">
                {tierDisplayName(tier, language)}
              </h4>
              {isTrial ? (
                <>
                  <p className="mt-3 text-[2.4rem] font-extrabold leading-none text-zinc-50">
                    {language === "en" ? "Free" : "Miễn phí"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500">
                    {language === "en" ? "for 14 days" : "trong 14 ngày"}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-[2.4rem] font-extrabold leading-none text-zinc-50">
                    {formatAmount(totalAmount, planData?.currency, language)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-500">/{cycleText}</p>
                </>
              )}

              {planData?.description ? (
                <p className="mt-4 text-sm text-zinc-400">{planData.description}</p>
              ) : null}

              <ul className="mt-5 space-y-2.5 text-sm text-zinc-200">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1.5 text-[10px] text-zinc-500">●</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-[#111111] p-5 text-zinc-100">
              <h4 className="text-base font-semibold text-white">
                {isTrial
                  ? language === "en"
                    ? "Trial Activation"
                    : "Kích hoạt dùng thử"
                  : language === "en"
                    ? "Payment Setup"
                    : "Thiết lập thanh toán"}
              </h4>

              <div className="mt-4 space-y-4">
                {!isTrial && (
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {language === "en" ? "Billing cycle" : "Chu kỳ thanh toán"}
                    </label>
                    <select
                      value={billingCycle}
                      onChange={(e) => onBillingCycleChange(e.target.value as BillingCycle)}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-white"
                    >
                      <option value="MONTHLY">{language === "en" ? "Monthly" : "Tháng"}</option>
                      <option value="QUARTERLY">{language === "en" ? "Quarterly" : "Quý"}</option>
                      <option value="YEARLY">{language === "en" ? "Yearly" : "Năm"}</option>
                    </select>
                  </div>
                )}

                {isTrial && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
                    {language === "en"
                      ? "Trial plan lasts 14 days and does not require billing cycle."
                      : "Gói dùng thử có thời hạn 14 ngày và không cần chọn chu kỳ thanh toán."}
                  </div>
                )}

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    {isTrial
                      ? language === "en"
                        ? "Activation cost"
                        : "Chi phí kích hoạt"
                      : language === "en"
                        ? "Total amount"
                        : "Tổng thanh toán"}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-emerald-300">
                    {formatAmount(totalAmount, planData?.currency, language)}
                  </p>
                </div>

                {confirmError && (
                  <p className="text-sm text-red-400">{confirmError}</p>
                )}

                <button
                  type="button"
                  disabled={confirmLoading}
                  onClick={() => void onConfirm()}
                  className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-400 disabled:opacity-60"
                >
                  {confirmLoading
                    ? language === "en"
                      ? "Processing..."
                      : "Đang xử lý..."
                    : isTrial
                      ? language === "en"
                        ? "Activate 14-day trial"
                        : "Kích hoạt dùng thử 14 ngày"
                    : language === "en"
                      ? "Confirm and Continue"
                      : "Xác nhận và tiếp tục"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentPendingSection({
  data,
  language,
  onClose,
  onSuccess,
  compact = false,
}: {
  data: SelectPlanResponse;
  language: "vi" | "en";
  onClose: () => void;
  onSuccess: () => void;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);
  const [failedQrUrl, setFailedQrUrl] = useState<string | null>(null);
  const locale = language === "en" ? "en-US" : "vi-VN";
  const amountText =
    data.amount == null
      ? "—"
      : (data.currency ?? "VND") === "VND"
        ? `${data.amount.toLocaleString(locale)}đ`
        : `${data.amount.toLocaleString(locale)} ${data.currency}`;
  const statusText =
    status === "SUCCESS"
      ? language === "en"
        ? "Payment successful"
        : "Thanh toán thành công"
      : status === "PENDING"
        ? language === "en"
          ? "Waiting for confirmation"
          : "Đang chờ xác nhận"
        : status;

  // Debug QR URL
  useEffect(() => {
    console.log("Payment data:", data);
    console.log("QR Image URL:", data.qr_image_url);
  }, [data]);

  // Build QR URL from bank info if template variables not replaced
  const getQRImageUrl = () => {
    if (!data.qr_image_url) return null;
    
    // Check if URL has template variables
    if (data.qr_image_url.includes('${')) {
      console.warn("QR URL has template variables, building from bank info");
      
      // Extract bank code from bank_name or use default
      const bankCode = data.bank_name === "TPBANK" ? "970423" : "970423"; // Default to TPBANK
      const bankAccount = data.bank_account || "";
      const accountName = data.account_name || "";
      const amount = data.amount || 0;
      const addInfo = encodeURIComponent(data.transaction_code || "");
      
      return `https://img.vietqr.io/image/${bankCode}-${bankAccount}-compact2.jpg?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(accountName)}`;
    }
    
    return data.qr_image_url;
  };

  const qrImageUrl = getQRImageUrl();
  const qrLoadFailed = !!qrImageUrl && failedQrUrl === qrImageUrl;

  useEffect(() => {
    if (!data.payment_id || !polling) return;
    const interval = setInterval(async () => {
      try {
        const result = await getPaymentStatus(data.payment_id);
        setStatus(result.status);
        if (result.status === "SUCCESS") {
          setPolling(false);
          onSuccess();
        }
      } catch {
        // keep polling
      }
    }, (data.polling_interval_seconds ?? 5) * 1000);
    return () => clearInterval(interval);
  }, [data.payment_id, data.polling_interval_seconds, polling, onSuccess]);

  return (
    <section className={`${compact ? "" : "mb-8"} rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-800 dark:bg-zinc-950`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          {language === "en" ? "Waiting for payment" : "Đang chờ thanh toán"}
        </h3>
        {!compact && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
          >
            {language === "en" ? "Close" : "Đóng"}
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Section */}
        {qrImageUrl && !qrLoadFailed ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {language === "en" ? "Scan QR code to pay" : "Quét mã QR để thanh toán"}
            </p>
            <div className="relative">
              <Image
                src={qrImageUrl} 
                alt={language === "en" ? "Payment QR code" : "QR thanh toán"}
                width={256}
                height={256}
                unoptimized
                className="h-64 w-64 rounded-xl border-2 border-emerald-500 bg-white p-2 object-contain shadow-lg"
                onError={() => {
                  console.error("QR Image failed to load:", qrImageUrl);
                  setFailedQrUrl(qrImageUrl);
                }}
              />
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              {language === "en"
                ? "Use your banking app to scan this QR code"
                : "Sử dụng app ngân hàng để quét mã QR"}
            </p>
            {data.qr_image_url?.includes('${') && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                {language === "en"
                  ? "Warning: QR URL was generated from bank transfer details"
                  : "Cảnh báo: URL được tạo từ thông tin ngân hàng"}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="text-center text-sm text-amber-800 dark:text-amber-200">
              {language === "en"
                ? "Warning: Unable to load QR code. Please make a manual transfer."
                : "Cảnh báo: Không thể tải mã QR. Vui lòng chuyển khoản thủ công."}
            </p>
          </div>
        )}

        {/* Payment Info Section */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {language === "en" ? "Transaction code" : "Mã giao dịch"}
            </p>
            <p className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {data.transaction_code}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {language === "en" ? "Amount" : "Số tiền"}
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {amountText}
            </p>
          </div>

          {data.bank_account && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {language === "en" ? "Bank transfer details" : "Thông tin chuyển khoản"}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">{language === "en" ? "Bank:" : "Ngân hàng:"}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{data.bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">{language === "en" ? "Account number:" : "Số tài khoản:"}</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{data.bank_account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">{language === "en" ? "Account holder:" : "Chủ tài khoản:"}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{data.account_name}</span>
                </div>
              </div>
            </div>
          )}

          {status && (
            <div className={`rounded-2xl border p-4 ${
              status === "SUCCESS" 
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30" 
                : status === "PENDING"
                ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            }`}>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                {language === "en" ? "Status" : "Trạng thái"}
              </p>
              <p className={`text-sm font-semibold ${
                status === "SUCCESS" 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : status === "PENDING"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}>
                {statusText}
              </p>
            </div>
          )}
        </div>
      </div>

      {!data.qr_image_url && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          {language === "en"
            ? "Warning: QR code is unavailable. Please make a manual transfer using the details above."
            : "Cảnh báo: Mã QR không khả dụng. Vui lòng chuyển khoản thủ công theo thông tin bên trên."}
        </div>
      )}
    </section>
  );
}
