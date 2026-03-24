"use client";

import { PanelLeft, Plus, Search, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLanguageStore } from "@/lib/language-store";

interface ChatHistorySidebarProps {
  open: boolean;
  onToggle: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
}

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  category: "today" | "yesterday" | "last7days" | "older";
}

export function ChatHistorySidebar({
  open,
  onToggle,
  onSelectChat,
  currentChatId,
}: ChatHistorySidebarProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";

  const chatHistory: ChatHistory[] = [];
  const categoryLabels = {
    today: isEn ? "Today" : "Hôm nay",
    yesterday: isEn ? "Yesterday" : "Hôm qua",
    last7days: isEn ? "Last 7 days" : "7 ngày qua",
    older: isEn ? "Older" : "Cũ hơn",
  };
  const groupedChats = chatHistory.reduce((acc, chat) => {
    if (!acc[chat.category]) {
      acc[chat.category] = [];
    }
    acc[chat.category].push(chat);
    return acc;
  }, {} as Record<string, ChatHistory[]>);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-[100] h-full border-r border-zinc-200 bg-zinc-100/90 backdrop-blur transition-[width] duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-900/90",
        open ? "w-72" : "w-14"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-3 dark:border-zinc-800">
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label={isEn ? "Toggle sidebar" : "Bật/tắt thanh bên"}
            type="button"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-zinc-200 p-2 dark:border-zinc-800">
          <button
            onClick={() => onSelectChat("")}
            className={cn(
              "flex w-full items-center rounded-lg px-2.5 py-2 text-sm text-zinc-700 transition hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800",
              !open && "justify-center"
            )}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {open ? <span className="ml-2">{isEn ? "New chat" : "Cuộc chat mới"}</span> : null}
          </button>
          {open ? (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-2.5 py-2 dark:border-zinc-700 dark:bg-zinc-950">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder={isEn ? "Search chats..." : "Tìm lịch sử chat..."}
                className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-500 outline-none dark:text-white dark:placeholder-zinc-400"
              />
            </div>
          ) : null}
        </div>

        {open ? (
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {Object.keys(groupedChats).length === 0 ? (
              <div className="rounded-lg px-3 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                {isEn
                  ? "No chat history yet. Conversations will appear here when synced from the server."
                  : "Chưa có lịch sử chat. Các cuộc hội thoại sẽ hiển thị tại đây khi được đồng bộ từ server."}
              </div>
            ) : null}
            {Object.entries(groupedChats).map(([category, chats]) => (
              <div key={category} className="mb-3">
                <h3 className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-left transition hover:bg-zinc-200 dark:hover:bg-zinc-800",
                        currentChatId === chat.id && "bg-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                            {chat.title}
                          </h4>
                          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {chat.preview}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-400">
                          <Clock className="h-3 w-3" />
                          <span>{chat.timestamp}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center gap-2 py-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <MessageSquare className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <Clock className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
