import { AppHeader } from "@/components/layout/AppHeader";
import { EmployeesTable } from "@/components/tenant-admin/EmployeesTable";
import { Button } from "@/components/ui";
import { UserPlus, Download, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EmployeesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-zinc-100 via-white to-zinc-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <AppHeader />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <Link
            href="/tenant-admin"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Dashboard
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Quản lý Nhân viên
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
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
      </main>
    </div>
  );
}
