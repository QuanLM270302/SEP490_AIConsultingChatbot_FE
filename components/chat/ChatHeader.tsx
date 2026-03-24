"use client";

import { Bot, Sparkles } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

export function ChatHeader() {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <header className="px-6 pb-2 pt-4">
      <div className="animate-gradient relative overflow-hidden rounded-2xl bg-[length:220%_220%] bg-gradient-to-r from-lime-400 via-fuchsia-500 via-emerald-400 to-violet-600 px-5 py-4 shadow-md shadow-fuchsia-500/15 dark:shadow-lg dark:shadow-emerald-500/25">
        <div className="pointer-events-none absolute inset-0 bg-black/20 dark:bg-black/10" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 left-1/4 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white sm:text-xl">
                {isEn ? "Internal AI Consulting Chatbot" : "AI Chatbot Tư vấn Nội bộ"}
              </h1>
              <p className="mt-1 text-xs text-white/90 sm:text-sm">
                {isEn
                  ? "Ask questions in English • RAG-powered • Based on company documents"
                  : "Đặt câu hỏi bằng tiếng Việt • RAG-powered • Dựa trên tài liệu công ty"}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm sm:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            {isEn ? "Smart Search" : "Tìm kiếm thông minh"}
          </div>
        </div>
      </div>
    </header>
  );
}

