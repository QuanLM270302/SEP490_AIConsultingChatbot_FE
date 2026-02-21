"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { ContentManagerHeader } from "@/components/content-manager/ContentManagerHeader";
import { ContentManagerStatsCards } from "@/components/content-manager/ContentManagerStatsCards";
import { ContentManagerActionCards } from "@/components/content-manager/ContentManagerActionCards";

export default function ContentManagerPage() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-zinc-50 via-white to-blue-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <AppSidebar links={[{ href: "/content-manager", label: "Home" }]} />
      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <main className="mx-auto w-full max-w-7xl space-y-8">
        <ContentManagerHeader />
        <ContentManagerStatsCards />
        <ContentManagerActionCards />
      </main>
      </div>
    </div>
  );
}

