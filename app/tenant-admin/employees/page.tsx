"use client";

import { useState } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { EmployeesTable } from "@/components/tenant-admin/EmployeesTable";
import { CreateUserModal } from "@/components/tenant-admin/CreateUserModal";
import { UserPlus, Download, Upload, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

type CreateUserFeedback = {
  tone: "success" | "warning";
  message: string;
};

export default function EmployeesPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [createFeedback, setCreateFeedback] = useState<CreateUserFeedback | null>(null);

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
              onClick={() => {
                setCreateFeedback(null);
                setCreateOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-green-600"
            >
              <UserPlus className="h-4 w-4" />
              {t.addEmployee}
            </button>
          </div>
        </div>

        {createFeedback && (
          <div
            role="status"
            className={[
              "flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm",
              createFeedback.tone === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100",
            ].join(" ")}
          >
            <div className="flex items-start gap-2">
              {createFeedback.tone === "warning" ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
              )}
              <p>{createFeedback.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setCreateFeedback(null)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md opacity-70 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <EmployeesTable key={refreshKey} />

        <CreateUserModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={(emailSent) => {
            setRefreshKey((k) => k + 1);
            if (emailSent === false) {
              setCreateFeedback({
                tone: "warning",
                message:
                  "User created successfully, but the welcome email could not be sent. Please share login credentials manually.",
              });
              return;
            }
            setCreateFeedback({
              tone: "success",
              message: "User created successfully. Welcome email has been sent.",
            });
          }}
        />
      </div>
    </TenantAdminLayout>
  );
}
