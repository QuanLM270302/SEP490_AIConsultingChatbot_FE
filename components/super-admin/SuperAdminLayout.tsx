"use client";

import { SuperAdminSidebar } from "./SuperAdminSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useState } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="flex min-h-dvh w-full min-w-0 overflow-x-hidden bg-linear-to-br from-zinc-100 via-white to-zinc-100 px-3 py-4 dark:from-zinc-900 dark:via-black dark:to-zinc-900 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
      <SuperAdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main className="min-w-0 flex-1 px-0 py-2 sm:px-3 lg:px-4 lg:pl-72 xl:pl-72">
        <DashboardHeader 
          title={t.superAdmin}
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <div className="mx-auto mt-5 w-full min-w-0 max-w-[min(100%,88rem)] lg:mt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
