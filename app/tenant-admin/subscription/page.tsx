"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SubscriptionHeader } from "@/components/subscription/SubscriptionHeader";
import { SubscriptionTabs } from "@/components/subscription/SubscriptionTabs";
import { SubscriptionInfo } from "@/components/tenant-admin/SubscriptionInfo";
import { BillingHistory } from "@/components/tenant-admin/BillingHistory";
import { getMySubscription, selectPlan } from "@/lib/api/subscription";
import { getPaymentHistory, getPaymentStatus } from "@/lib/api/payment";
import type { MySubscriptionResponse } from "@/lib/api/subscription";
import type { SelectPlanResponse } from "@/lib/api/subscription";
import type { BillingCycle } from "@/lib/api/subscription";
import type { SubscriptionTier } from "@/lib/api/subscription";

type TabId = "plans" | "billing" | "history";

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

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-green-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <SubscriptionHeader
          backHref="/tenant-admin"
          title="Tenant Admin / Subscription"
          description="Xem gói hiện tại, chọn gói mới (QR/bank transfer), hủy gói và xem lịch sử thanh toán. Payment đã tích hợp API."
        />

        <section className="mt-6 mb-6">
          <SubscriptionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </section>

        {activeTab === "plans" && (
          <>
            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              <SubscriptionInfo
                subscription={subscription}
                loading={subscriptionLoading}
                onUpdated={handleSubscriptionUpdated}
              />
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">Thanh toán gói subscription</h3>
              </div>
            </div>
            {paymentPending && (
              <PaymentPendingSection
                data={paymentPending}
                onClose={() => setPaymentPending(null)}
                onSuccess={handleSubscriptionUpdated}
              />
            )}
            <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as SubscriptionTier)}
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="STARTER">STARTER</option>
                <option value="STANDARD">STANDARD</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
              </select>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Chu kỳ thanh toán:</span>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="MONTHLY">Tháng</option>
                <option value="QUARTERLY">Quý</option>
                <option value="YEARLY">Năm</option>
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
                {selectPlanLoading ? "Đang xử lý…" : `Tạo thanh toán (${selectedTier})`}
              </button>
              {selectPlanError && <p className="text-sm text-red-600 dark:text-red-400">{selectPlanError}</p>}
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
              Thông tin thanh toán
            </h2>
            <p>
              Thanh toán qua chuyển khoản ngân hàng (QR hoặc chuyển khoản thủ công). Sau khi chọn gói ở tab &quot;Gói dịch vụ&quot;, hệ thống sẽ hiển thị mã giao dịch và thông tin chuyển khoản. Lịch sử giao dịch xem ở tab &quot;Lịch sử&quot;.
            </p>
          </section>
        )}

        {activeTab === "history" && (
          <BillingHistory payments={payments} loading={paymentsLoading} />
        )}
      </main>
    </div>
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
    <section className="mb-8 rounded-3xl border-2 border-amber-200 bg-amber-50/80 p-6 dark:border-amber-800 dark:bg-amber-950/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Đang chờ thanh toán</h3>
        <button type="button" onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-400">
          Đóng
        </button>
      </div>
      <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
        Mã giao dịch: <strong className="font-mono">{data.transaction_code}</strong> — Số tiền: {data.amount?.toLocaleString("vi-VN")}đ
      </p>
      {data.bank_account && (
        <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
          Chuyển khoản: <strong>{data.bank_name}</strong> — Số TK: <strong>{data.bank_account}</strong> — Chủ TK: {data.account_name}
        </p>
      )}
      {data.qr_image_url && (
        <div className="mb-4">
          <img src={data.qr_image_url} alt="QR thanh toán" className="h-48 w-48 rounded-lg border border-zinc-200 dark:border-zinc-700" />
        </div>
      )}
      {status && <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Trạng thái: {status}</p>}
    </section>
  );
}
