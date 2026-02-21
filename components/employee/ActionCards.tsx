import Link from "next/link";
import {
  CpuChipIcon,
  BookOpenIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export function ActionCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/employee/chatplatform"
        className="group relative overflow-hidden rounded-3xl border-2 border-green-200 bg-linear-to-br from-green-50 to-white p-8 shadow-lg transition-all hover:border-green-400 hover:shadow-xl dark:border-green-900/50 dark:from-green-950/30 dark:to-zinc-950"
      >
        <div className="relative z-10">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30">
            <CpuChipIcon className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            AI Chatbot
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Đặt câu hỏi bằng tiếng Việt và nhận câu trả lời chính xác dựa trên
            tài liệu công ty với công nghệ RAG
          </p>
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600 transition group-hover:gap-3 dark:text-green-400">
            <span>Bắt đầu chat ngay</span>
            <ArrowRightIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-200/20 blur-3xl dark:bg-green-500/10" />
      </Link>

      <div className="group rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-lg transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
          <BookOpenIcon className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Tài liệu
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Xem và tìm kiếm các tài liệu nội bộ của công ty, chính sách, quy
          trình và hướng dẫn
        </p>
        <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition group-hover:gap-3 dark:text-blue-400">
          <span>Khám phá</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="group rounded-3xl border-2 border-zinc-200 bg-white p-8 shadow-lg transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30">
          <ChartBarIcon className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Lịch sử
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Xem lại các câu hỏi và câu trả lời trước đây, đánh giá và quản lý
          lịch sử trò chuyện
        </p>
        <button className="flex items-center gap-2 text-sm font-semibold text-purple-600 transition group-hover:gap-3 dark:text-purple-400">
          <span>Xem lịch sử</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

