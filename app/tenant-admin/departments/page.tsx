import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { DepartmentsTable } from "@/components/tenant-admin/DepartmentsTable";
import { DepartmentStructure } from "@/components/tenant-admin/DepartmentStructure";
import { Plus } from "lucide-react";

export default function DepartmentsPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Quản lý Phòng ban
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Cấu trúc tổ chức và phân bổ nhân viên
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-green-600">
            <Plus className="h-4 w-4" />
            Thêm phòng ban
          </button>
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
