import {
  DocumentTextIcon,
  TagIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export function ContentManagerStatsCards() {
  const stats = [
    {
      label: "Tổng tài liệu",
      value: "1,245",
      change: "+12 tuần này",
      icon: DocumentTextIcon,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Tài liệu đã tag",
      value: "1,180",
      change: "94.8% tổng số",
      icon: TagIcon,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Lần re-index",
      value: "24",
      change: "Tháng này",
      icon: ArrowPathIcon,
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Quy tắc hiển thị",
      value: "18",
      change: "Đang hoạt động",
      icon: EyeIcon,
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Câu hỏi thường gặp",
      value: "156",
      change: "Top analytics",
      icon: ChartBarIcon,
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}

