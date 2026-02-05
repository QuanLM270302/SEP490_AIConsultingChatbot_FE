import { CheckCircle, AlertCircle } from "lucide-react";

const services = [
  { name: "API Server", status: "operational", uptime: "99.99%" },
  { name: "Database", status: "operational", uptime: "99.95%" },
  { name: "AI Service", status: "operational", uptime: "99.87%" },
  { name: "Storage", status: "operational", uptime: "100%" },
  { name: "Cache", status: "degraded", uptime: "98.50%" },
];

export function SystemHealth() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        System Health
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Tình trạng các dịch vụ hệ thống
      </p>
      
      <div className="mt-6 space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3">
              {service.status === "operational" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {service.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {service.status === "operational" ? "Hoạt động bình thường" : "Hiệu suất giảm"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {service.uptime}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Uptime</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
