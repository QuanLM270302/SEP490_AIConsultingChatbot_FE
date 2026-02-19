import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { RolesTable } from "@/components/tenant-admin/RolesTable";
import { PermissionsMatrix } from "@/components/tenant-admin/PermissionsMatrix";
import { Button } from "@/components/ui";
import { Shield } from "lucide-react";

export default function RolesPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Roles & Permissions
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Quản lý vai trò và phân quyền truy cập
            </p>
          </div>
          <Button variant="primary" size="md">
            <Shield className="mr-2 h-4 w-4" />
            Tạo role mới
          </Button>
        </div>

        <RolesTable />
        <PermissionsMatrix />
      </div>
    </TenantAdminLayout>
  );
}
