import { Shield, CheckCircle } from "lucide-react";

const policies = [
  { name: "GDPR Compliance", status: "active", lastUpdated: "2024-02-15" },
  { name: "ISO 27001", status: "active", lastUpdated: "2024-01-20" },
  { name: "Data Encryption", status: "active", lastUpdated: "2024-02-01" },
];

export function CompliancePolicies() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10">
          <Shield className="h-5 w-5 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Compliance Policies</h3>
      </div>
      <div className="mt-6 space-y-3">
        {policies.map((policy) => (
          <div key={policy.name} className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{policy.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Cập nhật: {policy.lastUpdated}</p>
              </div>
            </div>
            <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">ACTIVE</span>
          </div>
        ))}
      </div>
    </div>
  );
}
