"use client";

import { SubscriptionPlansTable } from "@/components/super-admin/SubscriptionPlansTable";
import { useLanguageStore } from "@/lib/language-store";

export default function PricingPage() {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Subscription Plans
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {isEn
              ? "Manage service plans and usage limits per tier."
              : "Quản lý các gói dịch vụ và giới hạn sử dụng theo từng plan."}
          </p>
        </div>

        <SubscriptionPlansTable />
      </div>
  );
}
