import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { RolesTable } from "@/components/tenant-admin/RolesTable";
import { PermissionsMatrix } from "@/components/tenant-admin/PermissionsMatrix";
import { Shield } from "lucide-react";

export default function RolesPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Roles & Permissions
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Quản lý vai trò và phân quyền truy cập
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-green-600">
            <Shield className="h-4 w-4" />
            Tạo role mới
          </button>
        </div>

        <RolesTable />
        <PermissionsMatrix />
      </div>
    </TenantAdminLayout>
  );
}
