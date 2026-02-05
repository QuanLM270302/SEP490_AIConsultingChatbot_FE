import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportsOverview } from "@/components/dashboard/ReportsOverview";
import { StatisticsCharts } from "@/components/dashboard/StatisticsCharts";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Reports & Statistics
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Xem báo cáo và thống kê toàn hệ thống
          </p>
        </div>

        <ReportsOverview />
        <StatisticsCharts />
      </div>
    </DashboardLayout>
  );
}
