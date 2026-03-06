"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { AppHeader } from "@/components/layout/AppHeader";
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";

type SubscriptionTier = "Starter" | "Standard" | "Enterprise";

export default function EmployeeSubscriptionPage() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("Starter");

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-green-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back + title */}
        <div className="mb-6">
          <Link
            href="/employee"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Quay lại
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Employee / Subscription
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Chọn gói phù hợp. Đề xuất nâng cấp sẽ được gửi thông báo tới Tenant Admin.
          </p>
        </div>

        {/* Gói đăng ký */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Gói đăng ký
          </h2>
          <SubscriptionTiers
            selectedTier={selectedTier}
            onTierSelect={setSelectedTier}
          />
        </section>

        {/* Đề xuất — thông báo Tenant Admin */}
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400">
              <EnvelopeIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                Đề xuất
              </h3>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                Khi bạn gửi đề xuất nâng cấp gói (hoặc yêu cầu thay đổi gói), Tenant Admin của tổ chức sẽ nhận thông báo qua email. Bạn có thể theo dõi trạng thái qua mục thông báo hoặc liên hệ trực tiếp Tenant Admin.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
