import { AppHeader } from "@/components/layout/AppHeader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-zinc-100 via-white to-zinc-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <AppHeader />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <Link
            href="/tenant-admin"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Dashboard
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Quản lý Tài liệu
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Quản lý document, document categories và document tags cho nền tảng
              tư vấn nội bộ AI. (TODO: kết nối API và bảng chi tiết sau.)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

