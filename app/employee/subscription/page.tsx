"use client";

export default function EmployeeSubscriptionPage() {
  return (
    <div className="min-h-dvh bg-linear-to-br from-zinc-50 via-white to-green-50/30 text-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <main className="flex min-h-dvh items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-lg dark:border-emerald-800 dark:bg-zinc-950">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Subscription được quản lý bởi Tenant Admin
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Nhân viên không thể tự thay đổi gói đăng ký. Nếu bạn muốn nâng cấp
            hoặc thay đổi gói, vui lòng liên hệ Tenant Admin của tổ chức.
          </p>
        </div>
      </main>
    </div>
  );
}
