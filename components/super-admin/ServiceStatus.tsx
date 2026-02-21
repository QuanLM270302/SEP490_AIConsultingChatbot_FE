import { CheckCircle } from "lucide-react";

const services = [
  { name: "API Gateway", status: "Operational" },
  { name: "Database Cluster", status: "Operational" },
  { name: "AI Processing", status: "Operational" },
  { name: "File Storage", status: "Operational" },
];

export function ServiceStatus() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Service Status</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {services.map((service) => (
          <div key={service.name} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">{service.name}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{service.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
