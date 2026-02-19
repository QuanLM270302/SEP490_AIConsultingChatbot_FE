import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { SystemMetrics } from "@/components/super-admin/SystemMetrics";
import { PerformanceCharts } from "@/components/super-admin/PerformanceCharts";
import { ServiceStatus } from "@/components/super-admin/ServiceStatus";

export default function SystemPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            System Health & Performance
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Giám sát tình trạng và hiệu suất hệ thống
          </p>
        </div>

        <SystemMetrics />
        <ServiceStatus />
        <PerformanceCharts />
      </div>
    </SuperAdminLayout>
  );
}
