"use client";

import { useState } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { EmployeesTable } from "@/components/tenant-admin/EmployeesTable";
import { CreateUserModal } from "@/components/tenant-admin/CreateUserModal";
import { UserPlus, Download, Upload } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export default function EmployeesPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {t.manageEmployees}
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {t.addEditDeleteEmployees}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <Upload className="h-4 w-4" />
              {t.import}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              <Download className="h-4 w-4" />
              {t.export}
            </button>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-green-600"
            >
              <UserPlus className="h-4 w-4" />
              {t.addEmployee}
            </button>
          </div>
        </div>

        <EmployeesTable key={refreshKey} />

        <CreateUserModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </TenantAdminLayout>
  );
}
