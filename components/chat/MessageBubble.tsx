"use client";

import { useLanguageStore } from "@/lib/language-store";

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  formattedContent?: React.ReactNode;
}

export function MessageBubble({
  content,
  isUser,
  formattedContent,
}: MessageBubbleProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
          isUser
            ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            : "bg-green-500 text-white font-semibold"
        }`}
      >
        {isUser ? (isEn ? "You" : "Bạn") : "AI"}
      </div>
      <div
        className={`flex-1 rounded-lg px-4 py-3 text-sm leading-relaxed ${
          "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
        }`}
      >
        {formattedContent || content}
      </div>
    </div>
  );
}

