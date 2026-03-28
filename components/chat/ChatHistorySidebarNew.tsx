"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, Clock } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";

interface ConversationListItem {
  id: string;
  title?: string;
  createdAt: string;
  lastMessageAt?: string;
}

interface ChatHistorySidebarNewProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
}

export function ChatHistorySidebarNew({
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  currentChatId
}: ChatHistorySidebarNewProps) {
  const { language } = useLanguageStore();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const data = await getConversations();
      // setConversations(data);
      
      // Mock data for now
      const mockData: ConversationListItem[] = [
        {
          id: "1",
          title: "Remote work policy questions",
          createdAt: new Date().toISOString(),
          lastMessageAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Benefits and compensation",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "3",
          title: "IT security guidelines",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          lastMessageAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
      ];
      setConversations(mockData);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = (convs: ConversationListItem[]) => {
    const today: ConversationListItem[] = [];
    const past7Days: ConversationListItem[] = [];
    const older: ConversationListItem[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const past7DaysStart = new Date(todayStart);
    past7DaysStart.setDate(past7DaysStart.getDate() - 7);

    convs.forEach((conv) => {
      const convDate = new Date(conv.lastMessageAt || conv.createdAt);
      if (convDate >= todayStart) {
        today.push(conv);
      } else if (convDate >= past7DaysStart) {
        past7Days.push(conv);
      } else {
        older.push(conv);
      }
    });

    return { today, past7Days, older };
  };

  const { today, past7Days, older } = groupByDate(conversations);

  return (
    <>
      {/* Overlay - only on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar with slide animation */}
      <aside className={`fixed top-0 z-30 flex h-full w-64 flex-col bg-white transition-all duration-300 ease-in-out dark:bg-zinc-950 ${
        isOpen ? "left-14" : "-left-64"
      }`}>
        {/* Spacer for menu button */}
        <div className="h-16"></div>
        
        {/* Content wrapper with fade-in */}
        <div className={`flex flex-1 flex-col transition-opacity duration-300 ${
          isOpen ? "opacity-100 delay-150" : "opacity-0"
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {language === "en" ? "Chat" : "Trò chuyện"}
            </h2>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={() => {
                onNewChat();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" />
              {language === "en" ? "New Chat" : "Chat mới"}
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
                  <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="mt-2 h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Today */}
              {today.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {language === "en" ? "Today" : "Hôm nay"}
                  </div>
                  <div className="space-y-1">
                    {today.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          onSelectChat(conv.id);
                        }}
                        className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          currentChatId === conv.id
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium">
                            {conv.title || (language === "en" ? "New conversation" : "Cuộc trò chuyện mới")}
                          </div>
                          <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(conv.lastMessageAt || conv.createdAt).toLocaleTimeString(
                              language === "vi" ? "vi-VN" : "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Past 7 Days */}
              {past7Days.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {language === "en" ? "Past 7 Days" : "7 ngày qua"}
                  </div>
                  <div className="space-y-1">
                    {past7Days.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          onSelectChat(conv.id);
                        }}
                        className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          currentChatId === conv.id
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium">
                            {conv.title || (language === "en" ? "New conversation" : "Cuộc trò chuyện mới")}
                          </div>
                          <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(conv.lastMessageAt || conv.createdAt).toLocaleDateString(
                              language === "vi" ? "vi-VN" : "en-US"
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Older */}
              {older.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 px-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {language === "en" ? "Older" : "Cũ hơn"}
                  </div>
                  <div className="space-y-1">
                    {older.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          onSelectChat(conv.id);
                        }}
                        className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                          currentChatId === conv.id
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate text-sm font-medium">
                            {conv.title || (language === "en" ? "New conversation" : "Cuộc trò chuyện mới")}
                          </div>
                          <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {new Date(conv.lastMessageAt || conv.createdAt).toLocaleDateString(
                              language === "vi" ? "vi-VN" : "en-US"
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {conversations.length === 0 && !loading && (
                <div className="py-8 text-center">
                  <MessageSquare className="mx-auto h-8 w-8 text-zinc-400" />
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {language === "en" ? "No conversations yet" : "Chưa có cuộc trò chuyện"}
                  </p>
                </div>
              )}
            </div>
          )}
          </div>

          {/* Footer */}
          <div className="p-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {language === "en" 
                ? `Chat history is saved up to 30 days` 
                : `Lịch sử chat được lưu tối đa 30 ngày`}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
