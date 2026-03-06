import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-zinc-100 via-white to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <DashboardTopBar />
      <div className="flex flex-1 px-4 py-6 sm:px-6 lg:px-10">
        <DashboardSidebar />
        <DashboardContent />
      </div>
    </div>
  );
}

