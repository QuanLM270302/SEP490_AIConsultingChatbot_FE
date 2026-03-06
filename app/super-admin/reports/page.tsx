import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { ReportsOverview } from "@/components/super-admin/ReportsOverview";
import { UsageStatistics } from "@/components/super-admin/UsageStatistics";
import { RevenueCharts } from "@/components/super-admin/RevenueCharts";

export default function ReportsPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Reports & Statistics
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Báo cáo và thống kê toàn hệ thống
          </p>
        </div>

        <UsageStatistics />
        <RevenueCharts />
        <ReportsOverview />
      </div>
    </SuperAdminLayout>
  );
}
