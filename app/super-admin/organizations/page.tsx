"use client";

import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { OrganizationsTable } from "@/components/super-admin/OrganizationsTable";
import { useLanguageStore } from "@/lib/language-store";

export default function OrganizationsPage() {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {isEn ? "Tenant Directory" : "Danh sách Tenant"}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {isEn
              ? "Super Admin can view registered tenants and their current status."
              : "Super Admin chỉ xem danh sách tenant đã đăng ký và trạng thái hiện tại."}
          </p>
        </div>

        <OrganizationsTable />
      </div>
    </SuperAdminLayout>
  );
}
