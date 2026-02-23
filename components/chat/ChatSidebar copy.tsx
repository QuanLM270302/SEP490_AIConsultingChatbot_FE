"use client";

import { Plus, MessageSquare, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatHistory {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
}

interface ChatSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

const mockChatHistory: ChatHistory[] = [
  {
    id: "1",
    title: "Quy trình nghỉ phép",
    preview: "Làm thế nào để xin nghỉ phép?",
    timestamp: "2 giờ trước",
  },
  {
    id: "2",
    title: "Chính sách bảo hiểm",
    preview: "Công ty có những loại bảo hiểm nào?",
    timestamp: "Hôm qua",
  },
  {
    id: "3",
    title: "Quy định làm việc từ xa",
    preview: "Tôi có thể làm việc từ xa không?",
    timestamp: "3 ngày trước",
  },
  {
    id: "4",
    title: "Thông tin lương thưởng",
    preview: "Lương được trả vào ngày nào?",
    timestamp: "1 tuần trước",
  },
];

export function ChatSidebar({
  open,
  setOpen,
  currentChatId,
  onSelectChat,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/80 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-14 z-50 w-80 border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950 lg:relative lg:top-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Conversations
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5 text-zinc-500" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={onNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-green-400/60 transition hover:bg-green-600"
            >
              <Plus className="h-5 w-5" />
              Cuộc trò chuyện mới
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="mb-2 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                <Clock className="h-3 w-3" />
                Lịch sử
              </div>
            </div>

            <div className="space-y-1">
              {mockChatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 rounded-2xl px-3 py-3 text-left transition",
                    currentChatId === chat.id
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {chat.title}
                      </p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {chat.preview}
                      </p>
                    </div>
                  </div>
                  <p className="ml-6 text-[10px] text-zinc-400">
                    {chat.timestamp}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
