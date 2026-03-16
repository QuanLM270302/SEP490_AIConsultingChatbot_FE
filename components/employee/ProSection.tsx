import Link from "next/link";
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  CursorArrowRaysIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export function ProSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-green-300 bg-linear-to-br from-green-400 via-green-500 to-green-600 p-8 text-white shadow-2xl shadow-green-500/30 dark:border-green-700">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <StarIcon className="h-3 w-3" /> Pro
          </span>
          <span className="text-sm opacity-90">Nâng cấp ngay</span>
        </div>
        <h2 className="mb-3 text-3xl font-bold">
          Nâng cấp lên Pro để trải nghiệm tốt hơn
        </h2>
        <p className="mb-6 text-lg opacity-90">
          Mở khóa toàn bộ tiềm năng của AI Chatbot với gói Pro
        </p>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <ChatBubbleLeftRightIcon className="mb-2 h-8 w-8" />
            <h3 className="mb-1 font-semibold">Chat không giới hạn</h3>
            <p className="text-sm opacity-80">
              Đặt câu hỏi không giới hạn số lượt, không lo hết quota
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <BookOpenIcon className="mb-2 h-8 w-8" />
            <h3 className="mb-1 font-semibold">Truy cập rộng hơn</h3>
            <p className="text-sm opacity-80">
              Truy cập vào nhiều tài liệu và nguồn thông tin hơn
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <CursorArrowRaysIcon className="mb-2 h-8 w-8" />
            <h3 className="mb-1 font-semibold">Độ chính xác cao hơn</h3>
            <p className="text-sm opacity-80">
              Câu trả lời chính xác hơn với AI model nâng cao
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-green-600 shadow-lg">
            Liên hệ Tenant Admin để nâng cấp{" "}
            <ArrowRightIcon className="ml-1 inline h-4 w-4" />
          </div>
          <div className="text-sm opacity-80">
            <span className="font-semibold">Gợi ý gói</span>{" "}
            <span className="text-xl font-bold">Starter/Standard/Enterprise</span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
}

