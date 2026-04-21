import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface SubscriptionHeaderProps {
  backHref?: string;
  title?: string;
  description?: string;
}

export function SubscriptionHeader({
  backHref = "/employee",
  title = "Quản lý Gói đăng ký",
  description = "Chọn gói phù hợp và quản lý thanh toán của bạn",
}: SubscriptionHeaderProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <div className="min-w-0">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Quay lại
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 sm:text-base lg:text-lg dark:text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}

