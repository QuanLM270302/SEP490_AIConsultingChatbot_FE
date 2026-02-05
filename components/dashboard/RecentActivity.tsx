import { Building2, UserPlus, Shield, AlertTriangle } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "organization",
    message: "Công ty ABC đã được thêm vào hệ thống",
    time: "5 phút trước",
    icon: Building2,
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    type: "user",
    message: "15 người dùng mới đăng ký từ Công ty XYZ",
    time: "1 giờ trước",
    icon: UserPlus,
    iconColor: "text-green-500",
  },
  {
    id: 3,
    type: "security",
    message: "Chính sách bảo mật đã được cập nhật",
    time: "2 giờ trước",
    icon: Shield,
    iconColor: "text-purple-500",
  },
  {
    id: 4,
    type: "alert",
    message: "Cảnh báo: CPU usage cao trên server 3",
    time: "3 giờ trước",
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Hoạt động gần đây
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Các sự kiện và thay đổi mới nhất
      </p>
      
      <div className="mt-6 flow-root">
        <ul role="list" className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-800"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800`}>
                      <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-zinc-900 dark:text-white">
                        {activity.message}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-zinc-500 dark:text-zinc-400">
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
