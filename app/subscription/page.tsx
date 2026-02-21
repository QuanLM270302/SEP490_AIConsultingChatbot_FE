"use client";

import { useState } from "react";
import type { Invoice } from "@/components/subscription/InvoiceList";
import { SubscriptionHeader } from "@/components/subscription/SubscriptionHeader";
import { SubscriptionTabs } from "@/components/subscription/SubscriptionTabs";
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";
import { BillingForm } from "@/components/subscription/BillingForm";
import { InvoiceList } from "@/components/subscription/InvoiceList";

type SubscriptionTier = "Starter" | "Standard" | "Enterprise";

export default function SubscriptionPage() {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>("Starter");
  const [activeTab, setActiveTab] = useState<"plans" | "billing" | "history">(
    "plans"
  );

  const invoices: Invoice[] = [
    {
      id: "INV-2024-001",
      date: "15/01/2024",
      amount: "299.000đ",
      status: "paid",
      description: "Gói Starter - Tháng 1/2024",
    },
    {
      id: "INV-2023-012",
      date: "15/12/2023",
      amount: "299.000đ",
      status: "paid",
      description: "Gói Starter - Tháng 12/2023",
    },
    {
      id: "INV-2023-011",
      date: "15/11/2023",
      amount: "299.000đ",
      status: "paid",
      description: "Gói Starter - Tháng 11/2023",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-green-50/30 px-4 py-8 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 sm:px-6 lg:px-10">
      <main className="mx-auto w-full max-w-7xl space-y-8">
        <SubscriptionHeader />
        <SubscriptionTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "plans" && (
          <SubscriptionTiers
            selectedTier={selectedTier}
            onTierSelect={setSelectedTier}
          />
        )}

        {activeTab === "billing" && <BillingForm />}

        {activeTab === "history" && <InvoiceList invoices={invoices} />}
      </main>
    </div>
  );
}

