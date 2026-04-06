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
    <div className="flex min-h-dvh bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <StaffSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main className="flex-1 p-6 lg:ml-72">
        <DashboardHeader title="Staff Dashboard" onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </main>
    </div>
  );
}
