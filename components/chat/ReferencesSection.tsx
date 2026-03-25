"use client";

import type { Reference } from "@/types/chat";
import { ReferenceCard } from "./ReferenceCard";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useLanguageStore } from "@/lib/language-store";

interface ReferencesSectionProps {
  references: Reference[];
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  if (references.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center gap-2">
        <BookOpenIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {isEn ? "References" : "Tài liệu tham khảo"}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-500">
          ({references.length} {isEn ? "sources" : "nguồn"})
        </span>
      </div>
      {references.map((ref, idx) => (
        <ReferenceCard key={idx} reference={ref} index={idx} />
      ))}
    </div>
  );
}

