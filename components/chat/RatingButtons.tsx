"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLanguageStore } from "@/lib/language-store";

interface RatingButtonsProps {
  messageId: string;
  currentRating: "helpful" | "not-helpful" | null;
  onRate: (messageId: string, rating: "helpful" | "not-helpful") => void;
}

export function RatingButtons({
  messageId,
  currentRating,
  onRate,
}: RatingButtonsProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-500 dark:text-zinc-500">
        {isEn ? "Was this answer helpful?" : "Câu trả lời này có hữu ích không?"}
      </span>
      <button
        onClick={() => onRate(messageId, "helpful")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
          currentRating === "helpful"
            ? "bg-green-900/50 text-green-400"
            : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-green-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-green-400"
        }`}
      >
        <CheckIcon className="h-4 w-4" />
        <span>{isEn ? "Helpful" : "Hữu ích"}</span>
      </button>
      <button
        onClick={() => onRate(messageId, "not-helpful")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
          currentRating === "not-helpful"
            ? "bg-rose-900/50 text-rose-400"
            : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-rose-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-rose-400"
        }`}
      >
        <XMarkIcon className="h-4 w-4" />
        <span>{isEn ? "Not helpful" : "Không hữu ích"}</span>
      </button>
    </div>
  );
}

