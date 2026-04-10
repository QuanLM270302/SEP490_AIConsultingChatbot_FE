"use client";

import { useState, useEffect } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { SubscriptionTabs } from "@/components/subscription/SubscriptionTabs";
import { SubscriptionInfo } from "@/components/tenant-admin/SubscriptionInfo";
import { BillingHistory } from "@/components/tenant-admin/BillingHistory";
import { getMySubscription, selectPlan } from "@/lib/api/subscription";
import { getPaymentHistory, getPaymentStatus } from "@/lib/api/payment";
import type { MySubscriptionResponse } from "@/lib/api/subscription";
import type { SelectPlanResponse } from "@/lib/api/subscription";
import type { BillingCycle } from "@/lib/api/subscription";
import type { SubscriptionTier } from "@/lib/api/subscription";
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

const PLAN_FEATURES_VI: Record<Exclude<SubscriptionTier, "TRIAL">, string[]> = {
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

const PLAN_FEATURES_EN: Record<Exclude<SubscriptionTier, "TRIAL">, string[]> = {
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

const PLAN_ACCENT_CLASS: Record<Exclude<SubscriptionTier, "TRIAL">, string> = {
  STARTER:
    "border-emerald-300 bg-linear-to-br from-emerald-100/90 via-emerald-50 to-white shadow-emerald-200/60 dark:border-emerald-800 dark:from-emerald-950/30 dark:via-emerald-950/20 dark:to-zinc-950",
  STANDARD:
    "border-cyan-300 bg-linear-to-br from-cyan-100/90 via-cyan-50 to-white shadow-cyan-200/60 dark:border-cyan-800 dark:from-cyan-950/30 dark:via-cyan-950/20 dark:to-zinc-950",
  ENTERPRISE:
    "border-violet-300 bg-linear-to-br from-violet-100/90 via-violet-50 to-white shadow-violet-200/60 dark:border-violet-800 dark:from-violet-950/30 dark:via-violet-950/20 dark:to-zinc-950",
};

function tierDisplayName(tier: SubscriptionTier, lang: "vi" | "en"): string {
  return lang === "vi" ? TIER_LABEL_VI[tier] : TIER_LABEL_EN[tier];
}

export default function TenantAdminSubscriptionPage() {
  const [activeTab, setActiveTab] = useState<TabId>("plans");
  const [subscription, setSubscription] = useState<MySubscriptionResponse | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [payments, setPayments] = useState<Awaited<ReturnType<typeof getPaymentHistory>>>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("STARTER");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [paymentPending, setPaymentPending] = useState<SelectPlanResponse | null>(null);
  const [selectPlanLoading, setSelectPlanLoading] = useState(false);
  const [selectPlanError, setSelectPlanError] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const t = translations[language];

  const loadSubscription = () => {
    setSubscriptionLoading(true);
    getMySubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null)) // 404 or error = no subscription
      .finally(() => setSubscriptionLoading(false));
  };

  const loadPayments = () => {
    setPaymentsLoading(true);
    getPaymentHistory()
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setPaymentsLoading(false));
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  useEffect(() => {
    if (activeTab === "history") loadPayments();
  }, [activeTab]);

  const handleConfirmPay = async () => {
    setSelectPlanError(null);
    setSelectPlanLoading(true);
    try {
      if (subscription && !subscription.isTrial && subscription.status === "ACTIVE") {
        if (subscription.cancelledAt) {
          const until = subscription.endDate
            ? new Date(subscription.endDate).toLocaleDateString("vi-VN")
            : "hết kỳ";
          throw new Error(
            `Gói hiện tại đã hủy nhưng vẫn còn hiệu lực đến ${until}. Bạn chỉ có thể mua gói mới sau khi gói hiện tại hết hạn.`
          );
        }
        throw new Error("Tenant đang có gói trả phí đang active. Vui lòng hủy gói hiện tại trước.");
      }
      if (!selectedTier) throw new Error("Chọn gói trước khi thanh toán");
      const data = await selectPlan(selectedTier, billingCycle);
      setPaymentPending(data);
    } catch (e) {
      setSelectPlanError(e instanceof Error ? e.message : "Chọn gói thất bại");
    } finally {
      setSelectPlanLoading(false);
    }
  };

  const handleSubscriptionUpdated = () => {
    loadSubscription();
    setPaymentPending(null);
    if (activeTab === "history") loadPayments();
  };

  const planCards: Exclude<SubscriptionTier, "TRIAL">[] = ["STARTER", "STANDARD", "ENTERPRISE"];

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
            <div className="mb-5 grid gap-4 lg:grid-cols-2">
              <SubscriptionInfo
                subscription={subscription}
                loading={subscriptionLoading}
                onUpdated={handleSubscriptionUpdated}
              />
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-white">
                  {t.createPayment} {t.subscription}
                </h3>
              </div>
            </div>
            {paymentPending && (
              <PaymentPendingSection
                data={paymentPending}
                onClose={() => setPaymentPending(null)}
                onSuccess={handleSubscriptionUpdated}
              />
            )}
            <div className="mb-5">
              <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {language === "en" ? "Select your plan" : "Chọn hạng gói phù hợp"}
              </h3>
              <div className="grid gap-4 lg:grid-cols-3">
                {planCards.map((tier) => {
                  const isSelected = selectedTier === tier;
                  const features =
                    language === "en" ? PLAN_FEATURES_EN[tier] : PLAN_FEATURES_VI[tier];
                  return (
                    <article
                      key={tier}
                      className={`rounded-2xl border p-6 shadow-lg transition-all duration-200 ${
                        PLAN_ACCENT_CLASS[tier]
                      } ${
                        isSelected
                          ? "scale-[1.01] ring-2 ring-emerald-400/80 shadow-2xl shadow-emerald-500/25"
                          : "opacity-95 hover:opacity-100 hover:shadow-xl"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                            {language === "en" ? "Plan" : "Hạng gói"}
                          </p>
                          <h4 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                            {tierDisplayName(tier, language === "en" ? "en" : "vi")}
                          </h4>
                        </div>
                        {isSelected ? (
                          <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                            {language === "en" ? "Selected" : "Đã chọn"}
                          </span>
                        ) : null}
                      </div>

                      <ul className="mt-4 min-h-[88px] space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40"
                            : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                        }`}
                      >
                        {isSelected
                          ? language === "en"
                            ? "Current selection"
                            : "Gói đang chọn"
                          : language === "en"
                            ? "Select this plan"
                            : "Chọn gói này"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.billingCycle}:
              </span>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="MONTHLY">{t.monthly}</option>
                <option value="QUARTERLY">{t.quarterly}</option>
                <option value="YEARLY">{t.yearly}</option>
              </select>
              <button
                type="button"
                disabled={
                  selectPlanLoading ||
                  (!!subscription && !subscription.isTrial && subscription.status === "ACTIVE")
                }
                onClick={handleConfirmPay}
                className="rounded-xl bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 disabled:opacity-50"
              >
                {selectPlanLoading
                  ? t.processing
                  : `${t.createPayment} (${tierDisplayName(
                      selectedTier,
                      language === "en" ? "en" : "vi"
                    )})`}
              </button>
              {selectPlanError && (
                <p className="text-sm text-red-600 dark:text-red-400">{selectPlanError}</p>
              )}
            </div>
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

function PaymentPendingSection({
  data,
  onClose,
  onSuccess,
}: {
  data: SelectPlanResponse;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [polling, setPolling] = useState(true);

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
    <section className="mb-8 rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-xl dark:border-emerald-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Đang chờ thanh toán</h3>
        <button 
          type="button" 
          onClick={onClose} 
          className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
        >
          Đóng
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code Section */}
        {qrImageUrl ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Quét mã QR để thanh toán
            </p>
            <div className="relative">
              <img 
                src={qrImageUrl} 
                alt="QR thanh toán" 
                className="h-64 w-64 rounded-xl border-2 border-emerald-500 bg-white p-2 shadow-lg object-contain" 
                onError={(e) => {
                  console.error("QR Image failed to load:", qrImageUrl);
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="h-64 w-64 flex items-center justify-center rounded-xl border-2 border-red-500 bg-red-50 p-4 text-center text-sm text-red-600">Không thể tải mã QR. Vui lòng chuyển khoản thủ công.</div>';
                  }
                }}
              />
            </div>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              Sử dụng app ngân hàng để quét mã QR
            </p>
            {data.qr_image_url?.includes('${') && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                ⚠️ URL được tạo từ thông tin ngân hàng
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ Mã QR không khả dụng
            </p>
          </div>
        )}

        {/* Payment Info Section */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Mã giao dịch</p>
            <p className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {data.transaction_code}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">Số tiền</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {data.amount?.toLocaleString("vi-VN")}đ
            </p>
          </div>

          {data.bank_account && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Thông tin chuyển khoản
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Ngân hàng:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{data.bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Số tài khoản:</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-50">{data.bank_account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Chủ tài khoản:</span>
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
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Trạng thái</p>
              <p className={`text-sm font-semibold ${
                status === "SUCCESS" 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : status === "PENDING"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}>
                {status === "SUCCESS" ? "✓ Thanh toán thành công" : status === "PENDING" ? "⏳ Đang chờ xác nhận" : status}
              </p>
            </div>
          )}
        </div>
      </div>

      {!data.qr_image_url && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          ⚠️ Mã QR không khả dụng. Vui lòng chuyển khoản thủ công theo thông tin bên trên.
        </div>
      )}
    </section>
  );
}
