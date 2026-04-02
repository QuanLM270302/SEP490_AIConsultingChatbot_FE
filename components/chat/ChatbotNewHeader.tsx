"use client";

import { Bot, Sparkles } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

type ChatbotNewHeaderProps = {
  /** Mở tab Tìm kiếm (đồng bộ với sidebar Search) */
  onSmartSearch?: () => void;
};

/** Banner tím–hồng giống `ChatHeader` (/chatbot cũ); layout phía dưới dùng emerald như các trang app */
export function ChatbotNewHeader({ onSmartSearch }: ChatbotNewHeaderProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <header className="relative z-20 shrink-0 bg-zinc-950 px-4 pb-3 pt-4 sm:px-5">
      <div className="animate-gradient relative overflow-hidden rounded-2xl bg-[length:220%_220%] bg-gradient-to-r from-lime-400 via-fuchsia-500 via-emerald-400 to-violet-600 px-4 py-3.5 shadow-md shadow-fuchsia-500/15 dark:shadow-lg dark:shadow-emerald-500/25 sm:px-5 sm:py-4">
        <div className="pointer-events-none absolute inset-0 bg-black/20 dark:bg-black/10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:h-11 sm:w-11">
              <Bot className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-white sm:text-lg md:text-xl">
                {isEn ? "Internal AI Consulting Chatbot" : "AI Chatbot Tư vấn Nội bộ"}
              </h1>
              <p className="mt-1 text-xs text-white/90 sm:text-sm">
                {isEn
                  ? "Ask questions in English • RAG-powered • Based on company documents"
                  : "Đặt câu hỏi bằng tiếng Việt • RAG-powered • Dựa trên tài liệu công ty"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSmartSearch}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-white/20 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:self-center sm:px-4 sm:text-sm"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-white" />
            {isEn ? "Smart Search" : "Tìm kiếm thông minh"}
          </button>
        </div>
      </div>
    </header>
  );
}
