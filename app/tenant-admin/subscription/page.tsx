"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SubscriptionHeader } from "@/components/subscription/SubscriptionHeader";
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";

type SubscriptionTier = "Starter" | "Standard" | "Enterprise";

export default function TenantAdminSubscriptionPage() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("Starter");

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-green-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <SubscriptionHeader
          backHref="/tenant-admin"
          title="Tenant Admin / Subscription"
          description="Quản lý gói đăng ký và thanh toán cho toàn bộ tổ chức."
        />

        <section className="mt-6 mb-8">
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
      </main>
    </div>
  );
}

