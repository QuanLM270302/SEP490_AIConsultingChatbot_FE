"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SubscriptionHeader } from "@/components/subscription/SubscriptionHeader";
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";
import { SubscriptionTabs } from "@/components/subscription/SubscriptionTabs";
import { InvoiceList, Invoice } from "@/components/subscription/InvoiceList";

type SubscriptionTier = "Starter" | "Standard" | "Enterprise";

export default function TenantAdminSubscriptionPage() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("Starter");
  const [activeTab, setActiveTab] = useState<"plans" | "billing" | "history">("plans");

  const mockInvoices: Invoice[] = [
    {
      id: "INV-2026-001",
      date: "01/03/2026",
      amount: "599.000đ",
      status: "paid",
      description: "Gói Standard - Tháng 03/2026",
    },
    {
      id: "INV-2026-002",
      date: "01/02/2026",
      amount: "599.000đ",
      status: "paid",
      description: "Gói Standard - Tháng 02/2026",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-green-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <SubscriptionHeader
          backHref="/tenant-admin"
          title="Tenant Admin / Subscription"
          description="Quản lý gói đăng ký và thanh toán cho toàn bộ tổ chức."
        />

        <section className="mt-6 mb-6">
          <SubscriptionTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </section>

        {activeTab === "plans" && (
          <>
            <section className="mb-8">
              <SubscriptionTiers
                selectedTier={selectedTier}
                onTierSelect={setSelectedTier}
              />
            </section>
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100">
              <p>
                Thay đổi gói đăng ký sẽ áp dụng cho toàn bộ nhân viên trong tổ
                chức. Hãy đảm bảo bạn đã trao đổi với các bên liên quan trước khi
                xác nhận nâng cấp hoặc hạ cấp gói.
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
              Kết nối phương thức thanh toán (thẻ, chuyển khoản, v.v.) sẽ được
              thực hiện ở bước tích hợp backend. Tạm thời đây là khu vực để Tenant
              Admin quản lý billing settings.
            </p>
          </section>
        )}

        {activeTab === "history" && <InvoiceList invoices={mockInvoices} />}
      </main>
    </div>
  );
}

