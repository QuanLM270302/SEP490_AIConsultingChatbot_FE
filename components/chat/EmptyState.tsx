import { CpuChipIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  onSelectExample: (example: string) => void;
}

export function EmptyState({ onSelectExample }: EmptyStateProps) {
  const examples = [
    "Đặt câu hỏi về tài liệu nội bộ",
    "Tìm thông tin chính sách công ty",
    "Hỏi về quy trình nghiệp vụ",
    "Tra cứu hướng dẫn sử dụng",
  ];

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <CpuChipIcon className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold text-zinc-50">
          Chào mừng đến với AI Chatbot
        </h2>
        <p className="mt-2 text-zinc-400">
          Đặt câu hỏi bằng tiếng Việt để nhận câu trả lời dựa trên tài liệu công ty
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => onSelectExample(example)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-300 transition hover:bg-zinc-800"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

