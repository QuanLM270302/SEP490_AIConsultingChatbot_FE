import {
  ChatBubbleLeftRightIcon,
  DocumentIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export function DashboardHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-green-400 via-green-500 to-green-400 p-4 text-white shadow-lg shadow-green-300/60 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-80">
            Internal Consultant AI Platform
          </p>
          <h1 className="text-xl font-semibold sm:text-2xl">General Dashboard</h1>
          <p className="text-xs opacity-90">
            RAG-powered chatbot platform for employees to get accurate,
            document-grounded answers.
          </p>
        </div>
          <div className="w-full max-w-sm space-y-3 md:text-right">
          <p className="text-xs font-medium opacity-90">
            Multi-tenant SaaS • Employees, Staff, Platform Admins
          </p>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-green-600 shadow-sm shadow-green-200 sm:px-4 sm:text-xs">
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              Ask AI Question
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-green-700/80 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-green-800/70 sm:px-4 sm:text-xs">
              <DocumentIcon className="h-4 w-4" />
              Upload Documents (Tenant Admin)
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-green-900/40 sm:px-4 sm:text-xs">
              <ShieldCheckIcon className="h-4 w-4" />
              Tenant &amp; Policy Admin
            </button>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-4/5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}

