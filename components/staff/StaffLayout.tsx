"use client";

import { useState } from "react";
import { StaffSidebar } from "./StaffSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface StaffLayoutProps {
  children: React.ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-dvh w-full min-w-0 overflow-x-hidden bg-linear-to-br from-zinc-50 via-white to-blue-50/30 px-3 py-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
      <StaffSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main className="min-w-0 flex-1 px-0 py-2 sm:px-3 lg:px-4 lg:pl-72 xl:pl-72">
        <DashboardHeader title="Staff Dashboard" onMenuClick={() => setSidebarOpen(true)} />
        <div className="mx-auto mt-5 w-full min-w-0 max-w-[min(100%,88rem)] lg:mt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
