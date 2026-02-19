export default function Home() {
  return (
    <div className="flex min-h-screen bg-linear-to-br from-zinc-100 via-white to-zinc-100 px-4 py-6 text-zinc-900 dark:from-zinc-900 dark:via-black dark:to-zinc-900 sm:px-6 lg:px-10">
      {/* Left sidebar */}
      <aside className="hidden w-64 shrink-0 rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/50 lg:flex">
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Primary Menu
              </p>
            </div>

            <nav className="space-y-1 text-sm">
              <button className="flex w-full items-center justify-between rounded-2xl bg-green-500 px-3.5 py-3 font-medium text-white shadow-sm shadow-green-400/60">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-sm">
                    ☰
                  </span>
                  Overview
                </span>
                <span className="h-8 w-1.5 rounded-full bg-white/70" />
              </button>

              {["Conversations", "Knowledge Base", "Analytics"].map((item) => (
                <button
                  key={item}
                  className="flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900">
                      ●
                    </span>
                    {item}
                  </span>
                  {item === "Conversations" && (
                    <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-rose-500">
                      52
                    </span>
                  )}
                </button>
              ))}

              <button className="flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50">
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-green-500/10 text-xs text-green-500">
                    🤖
                  </span>
                  AI Chatbot Workspace
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-green-500">
                    RAG
                  </span>
                </span>
              </button>
            </nav>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Settings</span>
                <button className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  See All
                </button>
              </div>
              <button className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900">
                  ?
                </span>
                Help
              </button>
              <button className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900">
                  ⚙
                </span>
                Profile Settings
              </button>
            </div>

            {/* Current plan / usage summary */}
            <div className="mt-4 space-y-3 rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  Plan: Starter
                </p>
                <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                  30 days left
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span>Messages</span>
                    <span>9,500 / 10,000</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-full w-[95%] rounded-full bg-green-500" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span>Storage</span>
                    <span>18 GB / 20 GB</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-full w-[90%] rounded-full bg-lime-400" />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Upgrade to Pro to reset limits and unlock higher quotas.
              </p>
            </div>

            {/* Tenant overview */}
            <div className="space-y-3 rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  Tenant overview
                </p>
                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                  3 active
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Employees</span>
                  <span>420 online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Content managers</span>
                  <span>18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chatbot sessions today</span>
                  <span>1,287</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Center content */}
      <main className="flex-1 px-0 py-2 sm:px-4 lg:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:max-w-6xl">
          {/* Greeting banner + quick actions */}
          <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-green-400 via-green-500 to-green-400 p-6 text-white shadow-lg shadow-green-300/60">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-80">
                  Internal Consultant AI Platform
                </p>
                <h1 className="text-2xl font-semibold">General Dashboard</h1>
                <p className="text-xs opacity-90">
                  RAG-powered chatbot platform for employees to get accurate,
                  document-grounded answers.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-3 md:text-right">
                <p className="text-xs font-medium opacity-90">
                  Multi-tenant SaaS • Employees, Content Managers, Platform
                  Admins
                </p>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-green-600 shadow-sm shadow-green-200">
                    <span>💬</span>
                    Ask AI Question
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-green-700/80 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-green-800/70">
                    <span>📄</span>
                    Upload Documents (Content Manager)
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-green-900/40">
                    <span>🛡</span>
                    Tenant &amp; Policy Admin
                  </button>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-4/5 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </section>

          {/* Metrics and charts */}
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
                  <span>▾</span>
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
                      New internal files ingested into the knowledge base this
                      month.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Questions & confidence chart */}
          <section className="space-y-4 rounded-3xl bg-white p-5 shadow-sm shadow-green-50 dark:bg-zinc-950 dark:shadow-black/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                487 Employee Questions
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-4 rounded-full bg-lime-400" />
                  Answered by AI
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-4 rounded-full bg-zinc-400" />
                  Escalated to HR/IT
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-4 rounded-full bg-rose-400" />
                  Low-confidence
                </span>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-12 gap-2">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((month, index) => (
                <div key={month} className="flex flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end justify-center rounded-2xl bg-zinc-50 p-1 dark:bg-zinc-900/80">
                    <div
                      className={`w-3 rounded-full ${
                        index === 2
                          ? "bg-green-400"
                          : index === 5
                          ? "bg-amber-400"
                          : index === 8
                          ? "bg-lime-400"
                          : "bg-zinc-300 dark:bg-zinc-700"
                      }`}
                      style={{
                        height:
                          index === 2
                            ? "70%"
                            : index === 5
                            ? "60%"
                            : index === 8
                            ? "65%"
                            : "30%",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500">{month}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              {["1 day", "1 Week", "1 Month", "1 Year", "5 Years", "All"].map(
                (label, idx) => (
                  <button
                    key={label}
                    className={`rounded-full px-3 py-1 ${
                      idx === 0
                        ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    } text-xs font-medium`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Right sidebar: review queue for RAG/QA quality */}
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
    </div>
  );
}

