import { Building2, Users, CheckCircle, TrendingUp } from "lucide-react";

const stats = [
  {
    name: "Tổng tổ chức",
    value: "24",
    change: "+12%",
    changeType: "positive",
    icon: Building2,
  },
  {
    name: "Người dùng hoạt động",
    value: "1,234",
    change: "+18%",
    changeType: "positive",
    icon: Users,
  },
  {
    name: "Yêu cầu chờ duyệt",
    value: "8",
    change: "-5%",
    changeType: "negative",
    icon: CheckCircle,
  },
  {
    name: "Uptime",
    value: "99.9%",
    change: "+0.1%",
    changeType: "positive",
    icon: TrendingUp,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-zinc-900 sm:p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="rounded-md bg-blue-500 p-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
