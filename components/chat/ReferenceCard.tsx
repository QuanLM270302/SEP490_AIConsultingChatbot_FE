import type { Reference } from "@/types/chat";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface ReferenceCardProps {
  reference: Reference;
  index: number;
}

export function ReferenceCard({ reference, index }: ReferenceCardProps) {
  return (
    <div className="group rounded-lg border border-zinc-800 bg-zinc-950 p-3 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-200">
              {reference.documentName}
            </p>
            {reference.confidence && (
              <span className="rounded-full bg-green-900/50 px-2 py-0.5 text-[10px] text-green-400">
                {Math.round(reference.confidence * 100)}% match
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            "{reference.excerpt}"
          </p>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
            <span>ID: {reference.documentId}</span>
            {reference.page && (
              <>
                <span>•</span>
                <span>Trang {reference.page}</span>
              </>
            )}
            <button className="flex items-center gap-1 text-green-400 hover:text-green-300">
              Xem tài liệu <ArrowRightIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

