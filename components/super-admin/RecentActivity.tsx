import { Building2, UserPlus, Shield, AlertTriangle } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

export function RecentActivity() {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  const activities = [
    {
      id: 1,
      message: isEn ? "Company ABC has been added to the platform" : "Công ty ABC đã được thêm vào hệ thống",
      time: isEn ? "5 minutes ago" : "5 phút trước",
      icon: Building2,
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      id: 2,
      message: isEn ? "15 new users registered from Company XYZ" : "15 người dùng mới đăng ký từ Công ty XYZ",
      time: isEn ? "1 hour ago" : "1 giờ trước",
      icon: UserPlus,
      bgColor: "bg-lime-500/10",
      iconColor: "text-lime-500",
    },
    {
      id: 3,
      message: isEn ? "Security policy has been updated" : "Chính sách bảo mật đã được cập nhật",
      time: isEn ? "2 hours ago" : "2 giờ trước",
      icon: Shield,
      bgColor: "bg-green-500/10",
      iconColor: "text-green-600",
    },
    {
      id: 4,
      message: isEn ? "Warning: high CPU usage on server 3" : "Cảnh báo: CPU usage cao trên server 3",
      time: isEn ? "3 hours ago" : "3 giờ trước",
      icon: AlertTriangle,
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {isEn ? "Recent Activity" : "Hoạt động gần đây"}
      </h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {isEn ? "Latest events and changes" : "Các sự kiện và thay đổi mới nhất"}
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
