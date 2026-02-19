import { Building2, UserPlus, Shield, AlertTriangle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "organization",
    message: "Công ty ABC đã được thêm vào hệ thống",
    time: "5 phút trước",
    icon: Building2,
    bgColor: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    id: 2,
    type: "user",
    message: "15 người dùng mới đăng ký từ Công ty XYZ",
    time: "1 giờ trước",
    icon: UserPlus,
    bgColor: "bg-lime-500/10",
    iconColor: "text-lime-500",
  },
  {
    id: 3,
    type: "security",
    message: "Chính sách bảo mật đã được cập nhật",
    time: "2 giờ trước",
    icon: Shield,
    bgColor: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    id: 4,
    type: "alert",
    message: "Cảnh báo: CPU usage cao trên server 3",
    time: "3 giờ trước",
    icon: AlertTriangle,
    bgColor: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Hoạt động gần đây
      </h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Các sự kiện và thay đổi mới nhất
      </p>
      
      <div className="mt-6 space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activity.bgColor}`}>
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </div>
            <div className="flex min-w-0 flex-1 justify-between gap-4">
              <p className="text-sm text-zinc-900 dark:text-white">
                {activity.message}
              </p>
              <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
