"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EmployeeHeader } from "@/components/employee/EmployeeHeader";
import { StatsCards } from "@/components/employee/StatsCards";
import { ActionCards } from "@/components/employee/ActionCards";
import { ProSection } from "@/components/employee/ProSection";
import { GuideSection } from "@/components/employee/GuideSection";
import { ProModal } from "@/components/employee/ProModal";

export default function EmployeePage() {
  const [showProModal, setShowProModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-linear-to-br from-zinc-50 via-white to-green-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <AppSidebar links={[{ href: "/employee", label: "Home" }]} />
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <main className="mx-auto w-full max-w-7xl space-y-8">
        <EmployeeHeader />
        <StatsCards />
        <ActionCards />
        <ProSection />
        <GuideSection />
      </main>

      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
      </div>
    </div>
  );
}
