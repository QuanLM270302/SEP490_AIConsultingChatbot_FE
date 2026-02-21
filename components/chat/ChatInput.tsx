import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/50 px-6 py-4">
      <form onSubmit={onSubmit} className="mx-auto max-w-4xl">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Làm thế nào để AI chatbot có thể giúp bạn?"
              rows={1}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/20"
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white transition hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <ArrowRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
        </p>
      </form>
    </div>
  );
}

