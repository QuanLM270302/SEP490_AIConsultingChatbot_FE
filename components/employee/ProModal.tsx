import Link from "next/link";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProModal({ isOpen, onClose }: ProModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-green-300 bg-white p-8 shadow-2xl dark:bg-zinc-950">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <h3 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Nâng cấp lên Pro
        </h3>
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
              Lợi ích Pro:
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                Chat không giới hạn số lượt
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                Truy cập vào nhiều tài liệu hơn
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                Câu trả lời chính xác hơn với AI model nâng cao
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                Ưu tiên hỗ trợ từ đội ngũ kỹ thuật
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Giá</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                299.000đ
                <span className="text-sm font-normal text-zinc-500">/tháng</span>
              </p>
            </div>
            <Link
              href="/employee/subscription"
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

