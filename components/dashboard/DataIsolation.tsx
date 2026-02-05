import { Database, Lock } from "lucide-react";

export function DataIsolation() {
  return (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Data Isolation
        </h3>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">
                Tenant Isolation
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Mỗi tổ chức có database riêng biệt
              </p>
            </div>
            <Lock className="h-5 w-5 text-green-500" />
          </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">
                Encryption at Rest
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                AES-256 encryption cho tất cả dữ liệu
              </p>
            </div>
            <Lock className="h-5 w-5 text-green-500" />
          </div>
        </div>
        
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-white">
                Access Logs
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Audit trail cho mọi truy cập dữ liệu
              </p>
            </div>
            <Lock className="h-5 w-5 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
