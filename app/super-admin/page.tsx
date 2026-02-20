import { AppSidebar } from "@/components/layout/AppSidebar";

export default function SuperAdminPage() {
  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <AppSidebar links={[{ href: "/super-admin", label: "Home" }]} />
      <main className="flex-1 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Super Admin
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This area is reserved for global platform configuration, tenant
          management, and high-level analytics.
        </p>
      </div>
      </main>
    </div>
  );
}

