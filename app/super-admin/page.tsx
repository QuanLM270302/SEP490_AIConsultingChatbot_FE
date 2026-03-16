import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { PlatformStats } from "@/components/super-admin/PlatformStats";
import { RecentActivity } from "@/components/super-admin/RecentActivity";
import { AIQueriesChart } from "@/components/super-admin/AIQueriesChart";
import { RevenueChart } from "@/components/super-admin/RevenueChart";
import { TenantDistribution } from "@/components/super-admin/TenantDistribution";
import { TenantGrowth } from "@/components/super-admin/TenantGrowth";
import { AIPerformance } from "@/components/super-admin/AIPerformance";
import { SystemHealth } from "@/components/super-admin/SystemHealth";

export default function SuperAdminDashboard() {
  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Platform Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quản lý và giám sát toàn bộ nền tảng
          </p>
        </div>

        {/* Platform Stats */}
        <PlatformStats />

        {/* AI Usage & Revenue */}
        <div className="grid gap-8 lg:grid-cols-2">
          <AIQueriesChart />
          <RevenueChart />
        </div>

        {/* Tenant Growth & Plan Distribution */}
        <div className="grid gap-8 lg:grid-cols-2">
          <TenantGrowth />
          <TenantDistribution />
        </div>

        {/* AI Performance */}
        <AIPerformance />

        {/* System Health & Recent Activity */}
        <div className="grid gap-8 lg:grid-cols-2">
          <SystemHealth />
          <RecentActivity />
        </div>
      </div>
    </SuperAdminLayout>
  );
}