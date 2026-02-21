import type { Reference } from "@/types/chat";
import { ReferenceCard } from "./ReferenceCard";
import { BookOpenIcon } from "@heroicons/react/24/outline";

interface ReferencesSectionProps {
  references: Reference[];
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  if (references.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2">
        <BookOpenIcon className="h-4 w-4 text-zinc-300" />
        <span className="text-xs font-semibold text-zinc-300">
          Tài liệu tham khảo
        </span>
        <span className="text-xs text-zinc-500">
          ({references.length} nguồn)
        </span>
      </div>
      {references.map((ref, idx) => (
        <ReferenceCard key={idx} reference={ref} index={idx} />
      ))}
    </div>
  );
}

