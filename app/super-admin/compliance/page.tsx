import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { CompliancePolicies } from "@/components/super-admin/CompliancePolicies";
import { DataIsolation } from "@/components/super-admin/DataIsolation";
import { AuditLogs } from "@/components/super-admin/AuditLogs";

export default function CompliancePage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Compliance & Data Isolation
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quản lý chính sách bảo mật và phân tách dữ liệu
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CompliancePolicies />
          <DataIsolation />
        </div>
        
        <AuditLogs />
      </div>
    </SuperAdminLayout>
  );
}
