"use client";

import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { AIMetrics } from "@/components/tenant-admin/AIMetrics";
import { AIUsageChart } from "@/components/tenant-admin/AIUsageChart";
import { TopQueriesTable } from "@/components/tenant-admin/TopQueriesTable";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export default function AnalyticsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {t.aiAnalytics}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {t.aiPerformanceDescription}
          </p>
        </div>

        <AIMetrics />
        <AIUsageChart />
        <TopQueriesTable />
      </div>
    </TenantAdminLayout>
  );
}
