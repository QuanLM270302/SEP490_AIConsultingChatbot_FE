import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { EmployeesTable } from "@/components/tenant-admin/EmployeesTable";
import { Button } from "@/components/ui";
import { UserPlus, Download, Upload } from "lucide-react";

export default function EmployeesPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Quản lý Nhân viên
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Thêm, sửa, xóa nhân viên trong tổ chức
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="md">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="md">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="primary" size="md">
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </div>
        </div>

        <EmployeesTable />
      </div>
    </TenantAdminLayout>
  );
}
