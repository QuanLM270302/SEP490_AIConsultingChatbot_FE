import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { DepartmentsTable } from "@/components/tenant-admin/DepartmentsTable";
import { DepartmentStructure } from "@/components/tenant-admin/DepartmentStructure";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

export default function DepartmentsPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Quản lý Phòng ban
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Cấu trúc tổ chức và phân bổ nhân viên
            </p>
          </div>
          <Button variant="primary" size="md">
            <Plus className="mr-2 h-4 w-4" />
            Thêm phòng ban
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DepartmentsTable />
          </div>
          <div>
            <DepartmentStructure />
          </div>
        </div>
      </div>
    </TenantAdminLayout>
  );
}
