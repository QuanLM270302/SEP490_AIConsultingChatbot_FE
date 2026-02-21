import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { PlatformStats } from "@/components/super-admin/PlatformStats";
import { SystemHealth } from "@/components/super-admin/SystemHealth";
import { RecentActivity } from "@/components/super-admin/RecentActivity";

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

        <PlatformStats />
        
        <div className="grid gap-8 lg:grid-cols-2">
          <SystemHealth />
          <RecentActivity />
        </div>
      </div>
    </SuperAdminLayout>
  );
}