import {
  Bars3Icon,
  CpuChipIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { DashboardAccountSection } from "@/components/dashboard/DashboardAccountSection";

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/50 lg:flex lg:flex-col">
      <div className="flex w-full flex-col p-5">
        {/* Primary Menu */}
        <div className="group/nav">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Primary Menu
          </p>
          <nav className="mt-3 space-y-1 text-sm">
            <button className="flex w-full min-w-0 items-center justify-between rounded-2xl bg-green-500 px-3.5 py-3 font-medium text-white shadow-sm shadow-green-400/60">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                  <Bars3Icon className="h-5 w-5" />
                </span>
                <span>Overview</span>
              </span>
              <span className="h-8 w-1.5 shrink-0 rounded-full bg-white/70" />
            </button>

            {["Conversations", "Document Dashboard", "Analytics"].map((item) => (
              <button
                key={item}
                className="flex w-full min-w-0 items-center justify-between rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </span>
                  <span>{item}</span>
                </span>
                {item === "Conversations" && (
                  <span className="shrink-0 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-500">
                    52
                  </span>
                )}
              </button>
            ))}

            <button className="flex w-full min-w-0 items-center justify-between rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                  <CpuChipIcon className="h-4 w-4" />
                </span>
                <span>AI Chatbot Workspace</span>
                <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-green-500">
                  RAG
                </span>
              </span>
            </button>
          </nav>
        </div>

        {/* Phân cách — Settings */}
        <div className="my-4 border-t border-zinc-200 dark:border-zinc-800" />
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Settings</span>
            <button className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              See All
            </button>
          </div>
          <button className="flex w-full min-w-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
              <QuestionMarkCircleIcon className="h-4 w-4" />
            </span>
            <span>Help</span>
          </button>
        </div>

        {/* Phân cách — Account */}
        <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800" />
        <DashboardAccountSection />
      </div>
    </aside>
  );
}

