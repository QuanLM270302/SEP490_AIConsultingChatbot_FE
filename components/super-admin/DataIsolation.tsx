import { Database, Lock } from "lucide-react";

export function DataIsolation() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10">
          <Database className="h-5 w-5 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Data Isolation</h3>
      </div>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Tenant Isolation</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Mỗi tổ chức có database riêng</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
              <Lock className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Encryption at Rest</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">AES-256 encryption</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
              <Lock className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
