import type { Message } from "@/types/chat";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ChatHistorySidebarProps {
  messages: Message[];
  selectedMessage: string | null;
  onSelectMessage: (messageId: string) => void;
  onNewChat: () => void;
}

export function ChatHistorySidebar({
  messages,
  selectedMessage,
  onSelectMessage,
  onNewChat,
}: ChatHistorySidebarProps) {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-zinc-800 bg-zinc-900 p-4 lg:flex">
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-50">Lịch sử</h2>
          <p className="text-xs text-zinc-400">
            {messages.length} cuộc trò chuyện
          </p>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-zinc-500">Chưa có lịch sử</p>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => onSelectMessage(msg.id)}
                className={`w-full rounded-lg border p-3 text-left text-xs transition ${
                  selectedMessage === msg.id
                    ? "border-green-500 bg-zinc-800"
                    : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800"
                }`}
              >
                <p className="font-medium text-zinc-200 line-clamp-2">
                  {msg.question}
                </p>
                <p className="mt-1.5 text-[10px] text-zinc-500">
                  {msg.timestamp.toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {msg.rating && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
                        msg.rating === "helpful"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-rose-900/50 text-rose-400"
                      }`}
                    >
                      {msg.rating === "helpful" ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <XMarkIcon className="h-3 w-3" />
                      )}
                    </span>
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <button
          onClick={onNewChat}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
        >
          + Cuộc trò chuyện mới
        </button>
      </div>
    </aside>
  );
}

