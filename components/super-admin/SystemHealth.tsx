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
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        System Health
      </h3>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Tình trạng các dịch vụ hệ thống
      </p>
      
      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                service.status === "operational" 
                  ? "bg-green-500/10" 
                  : "bg-amber-500/10"
              }`}>
                {service.status === "operational" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {service.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {service.status === "operational" ? "Hoạt động bình thường" : "Hiệu suất giảm"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {service.uptime}
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Uptime</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
