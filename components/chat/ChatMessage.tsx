import { User, Sparkles, ExternalLink } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: { title: string; excerpt: string }[];
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
          <Sparkles className="h-4 w-4 text-green-500" />
        </div>
      )}

      <div className={`flex-1 ${isUser ? "max-w-2xl" : ""}`}>
        <div
          className={`rounded-3xl px-4 py-3 ${
            isUser
              ? "bg-green-500 text-white"
              : "bg-white shadow-sm shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40"
          }`}
        >
          <p
            className={`whitespace-pre-wrap text-sm ${
              isUser ? "text-white" : "text-zinc-900 dark:text-white"
            }`}
          >
            {message.content}
          </p>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Nguồn tham khảo:
            </p>
            {message.sources.map((source, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-zinc-900 dark:text-white">
                      {source.title}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                      {source.excerpt}
                    </p>
                  </div>
                  <button className="shrink-0 text-green-500 hover:text-green-600">
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-2 text-[10px] text-zinc-400">{message.timestamp}</p>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800">
          <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </div>
      )}
    </div>
  );
}
