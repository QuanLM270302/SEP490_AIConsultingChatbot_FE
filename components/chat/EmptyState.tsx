"use client";

import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useLanguageStore } from "@/lib/language-store";

interface EmptyStateProps {
  onSelectExample: (example: string) => void;
}

export function EmptyState({ onSelectExample }: EmptyStateProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const examples = isEn
    ? [
        "Ask about internal documents",
        "Find company policy information",
        "Ask about business processes",
        "Look up usage guidelines",
      ]
    : [
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
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {isEn ? "Welcome to the AI Chatbot" : "Chào mừng đến với AI Chatbot"}
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {isEn
            ? "Ask questions in English to get answers based on company documents"
            : "Đặt câu hỏi bằng tiếng Việt để nhận câu trả lời dựa trên tài liệu công ty"}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => onSelectExample(example)}
              className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

