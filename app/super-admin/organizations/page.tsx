"use client";

import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { OrganizationsTable } from "@/components/super-admin/OrganizationsTable";
import { Button } from "@/components/ui";
import { Plus, Download } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

export default function OrganizationsPage() {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {isEn ? "Organization Management" : "Quản lý Tổ chức"}
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {isEn
                ? "Manage companies registered on the platform"
                : "Quản lý các công ty đăng ký sử dụng hệ thống"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="md">
              <Download className="mr-2 h-4 w-4" />
              {isEn ? "Export" : "Xuất dữ liệu"}
            </Button>
            <Button variant="primary" size="md">
              <Plus className="mr-2 h-4 w-4" />
              {isEn ? "Add organization" : "Thêm tổ chức"}
            </Button>
          </div>
        </div>

        <OrganizationsTable />
      </div>
    </SuperAdminLayout>
  );
}
