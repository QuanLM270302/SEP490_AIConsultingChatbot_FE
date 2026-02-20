import {
  DocumentPlusIcon,
  TagIcon,
  ArrowPathIcon,
  EyeSlashIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export function ContentManagerActionCards() {
  const actions = [
    {
      title: "Quản lý tài liệu",
      description:
        "Upload, chỉnh sửa, phân loại và xóa tài liệu nội bộ. Quản lý kho tài liệu tổ chức.",
      icon: DocumentPlusIcon,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      bgColor: "from-blue-50 to-white dark:from-blue-950/30 dark:to-zinc-950",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconText: "text-blue-600 dark:text-blue-400",
      linkText: "Quản lý tài liệu",
      href: "#",
    },
    {
      title: "Gắn thẻ tài liệu",
      description:
        "Gắn thẻ theo chủ đề HR, IT, Operations, Finance để phân loại và tìm kiếm dễ dàng.",
      icon: TagIcon,
      color: "from-green-500 to-green-600",
      borderColor: "border-green-200 dark:border-green-900/50",
      bgColor: "from-green-50 to-white dark:from-green-950/30 dark:to-zinc-950",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconText: "text-green-600 dark:text-green-400",
      linkText: "Quản lý thẻ",
      href: "#",
    },
    {
      title: "Ingestion & Re-indexing",
      description:
        "Kích hoạt ingestion và re-indexing tài liệu. Cập nhật dữ liệu mới vào hệ thống AI.",
      icon: ArrowPathIcon,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-200 dark:border-purple-900/50",
      bgColor: "from-purple-50 to-white dark:from-purple-950/30 dark:to-zinc-950",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconText: "text-purple-600 dark:text-purple-400",
      linkText: "Chạy re-indexing",
      href: "#",
    },
    {
      title: "Quy tắc hiển thị",
      description:
        "Quản lý quy tắc hiển thị nội dung nhạy cảm. Kiểm soát quyền truy cập tài liệu.",
      icon: EyeSlashIcon,
      color: "from-amber-500 to-amber-600",
      borderColor: "border-amber-200 dark:border-amber-900/50",
      bgColor: "from-amber-50 to-white dark:from-amber-950/30 dark:to-zinc-950",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconText: "text-amber-600 dark:text-amber-400",
      linkText: "Cấu hình quy tắc",
      href: "#",
    },
    {
      title: "Analytics & Insights",
      description:
        "Xem phân tích câu hỏi thường gặp, thống kê sử dụng tài liệu và hiệu suất hệ thống.",
      icon: ChartBarIcon,
      color: "from-rose-500 to-rose-600",
      borderColor: "border-rose-200 dark:border-rose-900/50",
      bgColor: "from-rose-50 to-white dark:from-rose-950/30 dark:to-zinc-950",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconText: "text-rose-600 dark:text-rose-400",
      linkText: "Xem analytics",
      href: "#",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, idx) => (
        <div
          key={idx}
          className={`group relative overflow-hidden rounded-3xl border-2 ${action.borderColor} bg-linear-to-br ${action.bgColor} p-8 shadow-lg transition-all hover:shadow-xl`}
        >
          <div className="relative z-10">
            <div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${action.color} text-white shadow-lg`}
            >
              <action.icon className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {action.title}
            </h2>
            <p className="mb-4 min-h-11 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {action.description}
            </p>
            <button
              className={`flex items-center gap-2 text-sm font-semibold ${action.iconText} transition group-hover:gap-3`}
            >
              <span>{action.linkText}</span>
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
          <div
            className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${action.iconBg} blur-3xl`}
          />
        </div>
      ))}
    </div>
  );
}

