import { HandRaisedIcon, StarIcon } from "@heroicons/react/24/outline";

export function EmployeeHeader() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="flex flex-wrap items-center gap-2.5 text-2xl font-bold tracking-tight text-zinc-900 sm:gap-3 sm:text-3xl lg:text-4xl dark:text-zinc-50">
            Chào mừng trở lại!{" "}
            <HandRaisedIcon className="h-8 w-8 text-green-500" />
          </h1>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base lg:text-lg dark:text-zinc-400">
            Hệ thống tư vấn nội bộ AI của bạn
          </p>
        </div>
        <div className="hidden items-center gap-3 rounded-2xl border-2 border-zinc-200 bg-linear-to-br from-white to-zinc-50 px-5 py-3 shadow-md dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30">
            <StarIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Gói hiện tại
            </p>
            <p className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Do Tenant Admin quản lý
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

