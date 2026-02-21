import { AppHeader } from "@/components/layout/AppHeader";
import { DepartmentsTable } from "@/components/tenant-admin/DepartmentsTable";
import { DepartmentStructure } from "@/components/tenant-admin/DepartmentStructure";
import { Button } from "@/components/ui";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DepartmentsPage() {
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
                Quản lý Phòng ban
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
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
      </main>
    </div>
  );
}
