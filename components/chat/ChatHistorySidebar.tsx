"use client";

import { useEffect, useState } from "react";
import { X, Plus, Search, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatHistorySidebarProps {
  open: boolean;
  onClose: () => void;
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

const mockChatHistory: ChatHistory[] = [
  {
    id: "1",
    title: "Quy trình nghỉ phép",
    preview: "Làm thế nào để xin nghỉ phép?",
    timestamp: "10:30",
    category: "today",
  },
  {
    id: "2",
    title: "Chính sách làm việc từ xa",
    preview: "Công ty có cho phép làm việc từ xa không?",
    timestamp: "09:15",
    category: "today",
  },
  {
    id: "3",
    title: "Quy định về trang phục",
    preview: "Dress code của công ty như thế nào?",
    timestamp: "Yesterday",
    category: "yesterday",
  },
  {
    id: "4",
    title: "Chế độ bảo hiểm",
    preview: "Công ty có những loại bảo hiểm nào?",
    timestamp: "2 days ago",
    category: "last7days",
  },
  {
    id: "5",
    title: "Quy trình onboarding",
    preview: "Nhân viên mới cần làm gì trong tuần đầu?",
    timestamp: "5 days ago",
    category: "last7days",
  },
];

const categoryLabels = {
  today: "Hôm nay",
  yesterday: "Hôm qua",
  last7days: "7 ngày qua",
  older: "Cũ hơn",
};

export function ChatHistorySidebar({
  open,
  onClose,
  onSelectChat,
  currentChatId,
}: ChatHistorySidebarProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setShouldRender(true);
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setIsAnimating(false);
      });
      // Delay unmounting to allow slide-out animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const groupedChats = mockChatHistory.reduce((acc, chat) => {
    if (!acc[chat.category]) {
      acc[chat.category] = [];
    }
    acc[chat.category].push(chat);
    return acc;
  }, {} as Record<string, ChatHistory[]>);

  if (!shouldRender) return null;

  return (
    <>
      {/* Sidebar with slide animation */}
      <aside
        className={cn(
          "fixed left-14 top-0 z-[100] h-full w-80 transform border-r border-zinc-200 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950",
          isAnimating ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Chat
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
            aria-label="Close sidebar"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <button
            onClick={() => {
              onSelectChat("");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-500 outline-none dark:text-white dark:placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="overflow-y-auto" style={{ height: "calc(100% - 200px)" }}>
          {Object.entries(groupedChats).map(([category, chats]) => (
            <div key={category} className="border-b border-zinc-200 dark:border-zinc-800">
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
              </div>
              <div className="space-y-1 px-2 pb-2">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-zinc-100 dark:hover:bg-zinc-900",
                      currentChatId === chat.id &&
                        "bg-blue-50 dark:bg-blue-950"
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
      </aside>
    </>
  );
}
