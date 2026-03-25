"use client";

import { MessageSquare } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

const topQueries = [
  { id: 1, question: "Làm thế nào để xin nghỉ phép?", count: 145, confidence: 98 },
  { id: 2, question: "Chính sách làm việc từ xa như thế nào?", count: 128, confidence: 95 },
  { id: 3, question: "Quy trình onboarding cho nhân viên mới?", count: 112, confidence: 97 },
  { id: 4, question: "Chế độ bảo hiểm của công ty?", count: 98, confidence: 92 },
  { id: 5, question: "Dress code của công ty?", count: 87, confidence: 89 },
];

export function TopQueriesTable() {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
        {t.mostAskedQuestions}
      </h3>
      <div className="space-y-4">
        {topQueries.map((query, index) => (
          <div
            key={query.id}
            className="flex items-start gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                #{index + 1}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-zinc-900 dark:text-white">
                {query.question}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {query.count} {t.queries}
                </span>
                <span className={`font-semibold ${
                  query.confidence >= 95 ? "text-green-600 dark:text-green-400" :
                  query.confidence >= 90 ? "text-blue-600 dark:text-blue-400" :
                  "text-amber-600 dark:text-amber-400"
                }`}>
                  {query.confidence}% {t.confidence}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
