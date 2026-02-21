import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function MetricsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      {/* Left graph card */}
      <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm shadow-green-50 dark:bg-zinc-950 dark:shadow-black/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-zinc-400">
              Knowledge Coverage Score
            </p>
            <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              87.52%
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            Weekly
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
        {/* Simple fake chart */}
        <div className="mt-4 h-40 rounded-2xl bg-linear-to-b from-green-50 via-white to-white p-4 dark:from-green-900/20 dark:via-zinc-950 dark:to-zinc-950">
          <div className="flex h-full items-end justify-between gap-2">
            {[75, 68, 78, 82, 77, 80].map((value, idx) => (
              <div
                key={idx}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-full bg-green-400"
                  style={{ height: `${40 + (value - 60)}%` }}
                />
                <span className="text-[10px] font-semibold text-green-600">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-green-500" />
              Previous
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-4 rounded-full bg-lime-400" />
              AI Prediction
            </span>
          </div>
          <span className="text-zinc-400">Updated 5 min ago</span>
        </div>
      </div>

      {/* Right small stats */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-3xl bg-white p-4 shadow-sm shadow-green-50 dark:bg-zinc-950 dark:shadow-black/40">
            <p className="text-xs font-medium text-zinc-400">
              AI Chatbot Messages (Employees)
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              95+
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-16 w-3 rounded-full bg-zinc-100 dark:bg-zinc-900">
                <div className="h-10 w-full rounded-full bg-rose-400" />
              </div>
              <p className="text-xs text-zinc-500">
                Conversations handled by the assistant this week.
              </p>
            </div>
          </div>

          <div className="flex-1 rounded-3xl bg-white p-4 shadow-sm shadow-green-50 dark:bg-zinc-950 dark:shadow-black/40">
            <p className="text-xs font-medium text-zinc-400">
              Document Uploads (Content Managers)
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              1875+
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-16 w-3 rounded-full bg-zinc-100 dark:bg-zinc-900">
                <div className="h-12 w-full rounded-full bg-green-400" />
              </div>
              <p className="text-xs text-zinc-500">
                New internal files ingested into the knowledge base this month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

