import { AppSidebar } from "@/components/layout/AppSidebar";

export default function TenantAdminPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <AppSidebar links={[{ href: "/tenant-admin", label: "Home" }]} />
      <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Tenant Admin
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Manage your organization&apos;s spaces, users, and chatbot settings
          here.
        </p>
      </div>
      </main>
    </div>
  );
}

