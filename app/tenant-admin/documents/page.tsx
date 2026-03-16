import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { DocumentsTable } from "@/components/tenant-admin/DocumentsTable";
import { DocumentStats } from "@/components/tenant-admin/DocumentStats";

export default function DocumentsPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Documents Management
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Quản lý tài liệu và knowledge base
            </p>
          </div>
          <button className="rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-green-600">
            Upload Document
          </button>
        </div>

        <DocumentStats />
        <DocumentsTable />
      </div>
    </TenantAdminLayout>
  );
}
