import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { OrganizationStats } from "@/components/tenant-admin/OrganizationStats";
import { EmployeeOverview } from "@/components/tenant-admin/EmployeeOverview";
import { DepartmentOverview } from "@/components/tenant-admin/DepartmentOverview";

export default function TenantAdminDashboard() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Organization Dashboard
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quản lý nhân viên và cấu trúc tổ chức
          </p>
        </div>

        <OrganizationStats />
        
        <div className="grid gap-8 lg:grid-cols-2">
          <EmployeeOverview />
          <DepartmentOverview />
        </div>
      </div>
    </TenantAdminLayout>
  );
}
