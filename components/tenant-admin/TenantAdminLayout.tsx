"use client";

import { TenantAdminSidebar } from "./TenantAdminSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useState } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface TenantAdminLayoutProps {
  children: React.ReactNode;
}

export function TenantAdminLayout({ children }: TenantAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="flex flex-1 bg-linear-to-br from-zinc-100 via-white to-zinc-100 px-4 py-6 dark:from-zinc-900 dark:via-black dark:to-zinc-900 sm:px-6 lg:px-10">
      <TenantAdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main className="flex-1 px-0 py-2 sm:px-4 lg:px-6 lg:pl-72">
        <DashboardHeader 
          title={t.tenantAdmin}
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <div className="mx-auto mt-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
