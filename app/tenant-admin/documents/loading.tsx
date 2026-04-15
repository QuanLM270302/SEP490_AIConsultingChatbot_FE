"use client";

import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";

export default function DocumentsLoading() {
  return (
    <TenantAdminLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-72 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-[30rem] max-w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        </div>

        <div className="flex gap-2 border-b border-zinc-200 pb-1 dark:border-zinc-800">
          <div className="h-10 w-40 animate-pulse rounded-t-lg bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-10 w-32 animate-pulse rounded-t-lg bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-10 w-28 animate-pulse rounded-t-lg bg-zinc-100 dark:bg-zinc-900" />
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="h-4 w-44 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-10 w-56 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </TenantAdminLayout>
  );
}
