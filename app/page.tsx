import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsSection } from "@/components/dashboard/MetricsSection";
import { QuestionsChart } from "@/components/dashboard/QuestionsChart";
import { DashboardRightSidebar } from "@/components/dashboard/DashboardRightSidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-zinc-100 via-white to-zinc-100 px-4 py-6 text-zinc-900 dark:from-zinc-900 dark:via-black dark:to-zinc-900 sm:px-6 lg:px-10">
      <DashboardSidebar />

      <main className="flex-1 px-0 py-2 sm:px-4 lg:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:max-w-6xl">
          <DashboardHeader />
          <MetricsSection />
          <QuestionsChart />
        </div>
      </main>

      <DashboardRightSidebar />
    </div>
  );
}

