export function DashboardRightSidebar() {
  return (
    <aside className="hidden w-80 shrink-0 rounded-3xl bg-zinc-900 p-5 text-zinc-50 shadow-xl shadow-zinc-900/60 lg:flex">
      <div className="flex h-full flex-col gap-6">
        <section className="space-y-3 rounded-2xl bg-zinc-950/40 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Items Requiring Review</span>
          </div>
          <div className="space-y-3">
            {[
              "Low-confidence answers to validate",
              "New documents awaiting tagging",
              "Escalated employee questions",
            ].map((label, idx) => (
              <div
                key={label}
                className="flex w-full items-center justify-between rounded-2xl bg-zinc-900 px-3 py-3 text-left text-xs text-zinc-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="mt-0.5 text-[10px] text-zinc-400">
                      Review and confirm to improve future answers.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* System status */}
        <section className="space-y-3 rounded-2xl bg-zinc-950/40 p-4 text-xs">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>System status</span>
          </div>
          <div className="space-y-2 text-zinc-300">
            <div className="flex items-center justify-between">
              <span>Chat API</span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Embedding index</span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                Synced
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Avg. response time</span>
              <span>820 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Error rate (last hour)</span>
              <span>0.3%</span>
            </div>
          </div>
        </section>

        {/* Upgrade to Pro (billing subscription) */}
        <section className="mt-auto space-y-3 rounded-2xl bg-linear-to-br from-lime-400 to-green-500 p-4 text-zinc-900">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-800/80">
              Upgrade
            </p>
            <p className="text-sm font-semibold">
              Unlock Pro features for your organization
            </p>
            <p className="text-[11px] text-zinc-800/80">
              Higher rate limits, advanced analytics, and priority support for
              your RAG chatbot.
            </p>
          </div>
          <button className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-lime-400 shadow-md shadow-zinc-900/40 hover:bg-zinc-800">
            Update to Pro
          </button>
        </section>
      </div>
    </aside>
  );
}

