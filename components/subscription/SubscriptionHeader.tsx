import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function SubscriptionHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Link
          href="/employee"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Quay lại
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Quản lý Gói đăng ký
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Chọn gói phù hợp và quản lý thanh toán của bạn
        </p>
      </div>
    </div>
  );
}

