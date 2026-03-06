export function QuestionsChart() {
  return (
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
  );
}

