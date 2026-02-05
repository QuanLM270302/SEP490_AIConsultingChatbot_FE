import { Shield, CheckCircle } from "lucide-react";

const policies = [
  { name: "GDPR Compliance", status: "active", lastUpdated: "2024-02-15" },
  { name: "ISO 27001", status: "active", lastUpdated: "2024-01-20" },
  { name: "Data Encryption", status: "active", lastUpdated: "2024-02-01" },
  { name: "Access Control", status: "active", lastUpdated: "2024-02-10" },
];

export function CompliancePolicies() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Compliance Policies
        </h3>
      </div>
      
      <div className="mt-6 space-y-3">
        {policies.map((policy) => (
          <div
            key={policy.name}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">
                  {policy.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Cập nhật: {policy.lastUpdated}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-green-600">ACTIVE</span>
          </div>
        ))}
      </div>
    </div>
  );
}
