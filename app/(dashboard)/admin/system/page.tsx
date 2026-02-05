import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SystemMetrics } from "@/components/dashboard/SystemMetrics";
import { PerformanceCharts } from "@/components/dashboard/PerformanceCharts";

export default function SystemPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            System Health & Performance
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Giám sát hiệu suất và tình trạng hệ thống
          </p>
        </div>

        <SystemMetrics />
        <PerformanceCharts />
      </div>
    </DashboardLayout>
  );
}
