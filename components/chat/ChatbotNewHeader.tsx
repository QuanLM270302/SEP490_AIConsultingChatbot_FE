"use client";

import { Bot, Sparkles } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

type ChatbotNewHeaderProps = {
  /** Mở tab Tìm kiếm (đồng bộ với sidebar Search) */
  onSmartSearch?: () => void;
};

/** Hero header — tím/indigo chủ đạo, ít “neon” hơn để tập trung vào khung chat bên dưới */
export function ChatbotNewHeader({ onSmartSearch }: ChatbotNewHeaderProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <header className="relative z-20 shrink-0 px-4 pb-3 pt-4 sm:px-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800 px-4 py-3.5 shadow-xl shadow-violet-900/25 ring-1 ring-white/10 sm:px-5 sm:py-4">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_65%)]" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-fuchsia-400/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner shadow-black/10 ring-1 ring-white/20 backdrop-blur-sm">
              <Bot className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg md:text-xl">
                {isEn ? "Internal AI Consulting Chatbot" : "AI Chatbot Tư vấn Nội bộ"}
              </h1>
              <p className="mt-0.5 text-xs leading-relaxed text-white/85 sm:text-sm">
                {isEn
                  ? "Ask in English or Vietnamese • RAG • Grounded in your company documents"
                  : "Đặt câu hỏi bằng tiếng Việt • RAG • Dựa trên tài liệu công ty"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSmartSearch}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-stretch rounded-xl bg-white/15 px-4 py-2.5 text-xs font-semibold text-white shadow-sm ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:self-auto sm:rounded-full sm:py-2 sm:text-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-amber-200" strokeWidth={2} />
            {isEn ? "Smart search" : "Tìm kiếm thông minh"}
          </button>
        </div>
      </div>
    </header>
  );
}
