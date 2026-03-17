import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { AIMetrics } from "@/components/tenant-admin/AIMetrics";
import { AIUsageChart } from "@/components/tenant-admin/AIUsageChart";
import { TopQueriesTable } from "@/components/tenant-admin/TopQueriesTable";

export default function AnalyticsPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            AI Analytics
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Phân tích hiệu suất và sử dụng AI chatbot
          </p>
        </div>

        <AIMetrics />
        <AIUsageChart />
        <TopQueriesTable />
      </div>
    </TenantAdminLayout>
  );
}
