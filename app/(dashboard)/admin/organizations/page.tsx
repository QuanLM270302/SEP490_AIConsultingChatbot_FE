import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OrganizationsTable } from "@/components/dashboard/OrganizationsTable";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";

export default function OrganizationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Quản lý Tổ chức
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Quản lý các công ty và tenant organizations
            </p>
          </div>
          <Button variant="primary" size="md">
            <Plus className="mr-2 h-4 w-4" />
            Thêm tổ chức
          </Button>
        </div>

        <OrganizationsTable />
      </div>
    </DashboardLayout>
  );
}
