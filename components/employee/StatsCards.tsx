import {
  ChatBubbleLeftRightIcon,
  CursorArrowRaysIcon,
  BoltIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

export function StatsCards() {
  const stats = [
    {
      label: "Câu hỏi hôm nay",
      value: "12",
      change: "+3 so với hôm qua",
      icon: ChatBubbleLeftRightIcon,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Độ chính xác",
      value: "87%",
      change: "Trung bình tuần này",
      icon: CursorArrowRaysIcon,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Lượt chat còn lại",
      value: "48/100",
      change: null,
      icon: BoltIcon,
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      showProgress: true,
      progress: 48,
    },
    {
      label: "Tài liệu truy cập",
      value: "1,245",
      change: "Tổng số tài liệu",
      icon: BookOpenIcon,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </div>
          {stat.showProgress ? (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          ) : (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {stat.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

