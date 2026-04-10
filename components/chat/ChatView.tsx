"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Sparkles,
  ExternalLink,
  FileText,
  Search,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { ChatHistorySidebarNew } from "./ChatHistorySidebarNew";
import { getStoredUser } from "@/lib/auth-store";
import { getProfile } from "@/lib/api/profile";
import { chat, getConversationHistory } from "@/lib/api/chatbot";
import { listTagsActive } from "@/lib/api/tags";
import type { DocumentTagResponse } from "@/types/knowledge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: {
    documentId?: string;
    documentName: string;
    confidence?: number;
  }[];
  timestamp: Date;
}

export interface ChatViewProps {
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
  onNavigateToSearch: (query?: string) => void;
}

export function ChatView({
  isHistoryOpen,
  onToggleHistory,
  onNavigateToSearch,
}: ChatViewProps) {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const currentUser = getStoredUser();
  const [displayName, setDisplayName] = useState(
    currentUser?.email?.split("@")[0] || (isEn ? "You" : "Bạn")
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<{
    documentId?: string;
    documentName: string;
    confidence?: number;
  } | null>(null);
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [topK, setTopK] = useState(5);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile?.fullName?.trim()) setDisplayName(profile.fullName.trim());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    listTagsActive()
      .then((activeTags) => setTags(activeTags))
      .catch(() => setTags([]));
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleNewChat = () => {
    setConversationId(null);
    setCurrentChatId(null);
    setMessages([]);
    setSelectedSource(null);
    setError(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    getConversationHistory(chatId).then((history) => {
      if (!history?.messages?.length) {
        setMessages([]);
        setConversationId(chatId);
        return;
      }
      const built: Message[] = [];
      const msgs = history.messages;
      for (let i = 0; i < msgs.length; i++) {
        if (msgs[i].role === "USER") {
          const userMsg = msgs[i];
          const assistantMsg = msgs[i + 1]?.role === "ASSISTANT" ? msgs[i + 1] : null;
          built.push({
            id: userMsg.id,
            role: "user",
            content: userMsg.content,
            timestamp: new Date(userMsg.createdAt ?? Date.now()),
          });
          if (assistantMsg) {
            built.push({
              id: assistantMsg.id,
              role: "assistant",
              content: assistantMsg.content,
              sources: (assistantMsg.sources ?? []).map((s) => ({
                documentId: s.documentId,
                documentName: s.fileName,
                confidence: s.relevanceScore,
              })),
              timestamp: new Date(assistantMsg.createdAt ?? Date.now()),
            });
            i++;
          }
        }
      }
      setMessages(built);
      setSelectedSource(null);
      setConversationId(chatId);
      setError(null);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat({
        message: text,
        conversationId: conversationId ?? undefined,
        topK,
        tagIds: selectedTagIds.length ? selectedTagIds : undefined,
      });

      if (response.conversationId) {
        setConversationId(response.conversationId);
        setCurrentChatId(response.conversationId);
        setHistoryRefresh((n) => n + 1);
      }

      const rawAnswer = response.answer ?? "";
      const looksLikeError =
        rawAnswer.includes("I apologize, but I encountered an error") ||
        rawAnswer.toLowerCase().includes("encountered an error");

      const answerText = looksLikeError
        ? isEn
          ? "Sorry, the system is busy. Please try again later."
          : "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau."
        : rawAnswer;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answerText,
        sources: (response.sources ?? []).map((s) => ({
          documentId: s.documentId,
          documentName: s.fileName,
          confidence: s.relevanceScore,
        })),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setError(isEn ? "Failed to get a response from the chatbot." : "Không thể nhận phản hồi từ chatbot.");
      const fallback: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isEn
          ? "Sorry, the system is busy. Please try again later."
          : "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQuestions = [
    isEn ? "What is the remote work policy?" : "Chính sách làm việc từ xa là gì?",
    isEn ? "How do I request time off?" : "Làm thế nào để xin nghỉ phép?",
    isEn ? "What are the company benefits?" : "Các quyền lợi của công ty là gì?",
  ];

  const userLabel = isEn ? "You" : "Bạn";

  return (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col">
      <ChatHistorySidebarNew
        isOpen={isHistoryOpen}
        onClose={onToggleHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        refreshTrigger={historyRefresh}
      />

      <div
        ref={scrollRef}
        className="scrollbar-chat-hidden mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-7 overflow-y-auto scroll-smooth px-5 pb-6 pt-3 sm:flex-row sm:items-start sm:pt-4"
      >
        <div className="relative mr-auto flex min-h-0 w-full min-w-0 max-w-6xl flex-1 flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex min-h-full flex-1 flex-col">
              {error ? (
                <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </div>
              ) : null}

              <details className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-2">
                    {isEn ? "RAG filters" : "Bộ lọc RAG"}
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </span>
                </summary>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-400">Top K</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={topK}
                      onChange={(e) =>
                        setTopK(Math.min(20, Math.max(1, Number(e.target.value) || 5)))
                      }
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-400">
                      {isEn ? "Tags" : "Thẻ"}
                    </label>
                    <div className="scrollbar-chat-hidden flex max-h-24 flex-wrap gap-2 overflow-y-auto">
                      {tags.slice(0, 16).map((tg) => {
                        const active = selectedTagIds.includes(tg.id);
                        return (
                          <button
                            key={tg.id}
                            type="button"
                            onClick={() => toggleTag(tg.id)}
                            className={`rounded-full px-2.5 py-1 text-xs transition ${
                              active
                                ? "bg-emerald-600 text-white"
                                : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            }`}
                          >
                            {tg.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </details>

              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/30">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="mb-3 text-center text-4xl font-semibold text-zinc-900 dark:text-white">
                    {isEn ? "Hello" : "Xin chào"},{" "}
                    <span className="text-emerald-600 dark:text-emerald-400">{displayName}</span>
                  </h2>
                  <p className="mb-10 max-w-lg text-center text-lg text-zinc-600 dark:text-zinc-400">
                    {isEn
                      ? "Ask about policies, HR, IT, and internal knowledge."
                      : "Hỏi về chính sách, HR, IT và tri thức nội bộ."}
                  </p>
                  <div className="w-full max-w-lg space-y-3">
                    <p className="text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {isEn ? "Try asking:" : "Thử hỏi:"}
                    </p>
                    {exampleQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInput(question)}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-left text-[15px] text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          message.role === "user"
                            ? "bg-zinc-200 dark:bg-zinc-700"
                            : "bg-emerald-600"
                        }`}
                      >
                        {message.role === "user" ? (
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <Sparkles className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          {message.role === "user" ? userLabel : isEn ? "AI Assistant" : "Trợ lý AI"}
                        </div>
                        <div className="text-[15px] leading-relaxed whitespace-pre-wrap text-zinc-900 dark:text-white">
                          {message.content}
                        </div>
                        {message.sources && message.sources.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.sources.map((source, idx) => (
                              <button
                                key={`${source.documentName}-${idx}`}
                                type="button"
                                onClick={() => setSelectedSource(source)}
                                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                              >
                                <span>{source.documentName}</span>
                                {source.confidence != null ? (
                                  <span className="text-emerald-600 dark:text-emerald-400">
                                    {Math.round(
                                      source.confidence <= 1
                                        ? source.confidence * 100
                                        : source.confidence
                                    )}
                                    %
                                  </span>
                                ) : null}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  {isLoading ? (
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex items-center gap-1 pt-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="mt-auto border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-end gap-3 rounded-xl border border-zinc-300 bg-white p-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      aria-label="Attach"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSubmit(e);
                        }
                      }}
                      placeholder={
                        isEn ? "Ask about policies, HR, IT…" : "Hỏi về chính sách, HR, IT…"
                      }
                      rows={1}
                      className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent text-[15px] text-zinc-900 placeholder-zinc-500 outline-none dark:text-white dark:placeholder-zinc-400"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="rounded-lg bg-emerald-600 p-2.5 text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
                <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  {isEn
                    ? "AI can make mistakes. Verify important information."
                    : "AI có thể mắc lỗi. Hãy xác minh thông tin quan trọng."}
                </p>
              </div>
            </div>
          </div>

          <aside className="sticky top-6 hidden w-[28rem] shrink-0 space-y-4 xl:block">
            <div className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
              <div className="mb-3 flex items-center gap-2 text-zinc-900 dark:text-white">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-semibold">
                  {isEn ? "Related documents" : "Tài liệu liên quan"}
                </h3>
              </div>
              {selectedSource ? (
                <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                  <p className="font-medium text-zinc-900 dark:text-white">{selectedSource.documentName}</p>
                  {selectedSource.confidence != null ? (
                    <p className="text-xs text-zinc-500">
                      {isEn ? "Relevance" : "Độ liên quan"}:{" "}
                      {Math.round(
                        selectedSource.confidence <= 1
                          ? selectedSource.confidence * 100
                          : selectedSource.confidence
                      )}
                      %
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onNavigateToSearch(selectedSource.documentName)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {isEn ? "Open in Search" : "Mở trong Tìm kiếm"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {isEn
                    ? "Select a source chip from an answer to see details and open it in Search."
                    : "Chọn một nguồn trong câu trả lời để xem chi tiết và mở ở mục Tìm kiếm."}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-emerald-50/80 to-white p-5 shadow-sm dark:border-zinc-800 dark:from-emerald-950/20 dark:to-zinc-950">
              <div className="mb-3 flex items-center gap-2 text-zinc-900 dark:text-white">
                <Lightbulb className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-semibold">{isEn ? "Tips" : "Gợi ý"}</h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <li>
                  {isEn
                    ? "Use the Search tab for full document lookup and preview."
                    : "Dùng tab Tìm kiếm để tra cứu và xem trước tài liệu đầy đủ."}
                </li>
              </ul>
              <button
                type="button"
                onClick={() => onNavigateToSearch()}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900 dark:bg-zinc-900 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
              >
                <Search className="h-4 w-4" />
                {isEn ? "Open Search tab" : "Mở mục Tìm kiếm"}
              </button>
            </div>
          </aside>
      </div>
    </div>
  );
}
