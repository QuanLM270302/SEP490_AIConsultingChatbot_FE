import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SystemHealth } from "@/components/dashboard/SystemHealth";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quản lý hệ thống và giám sát hoạt động
          </p>
        </div>

        <StatsCards />
        
        <div className="grid gap-8 lg:grid-cols-2">
          <SystemHealth />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
