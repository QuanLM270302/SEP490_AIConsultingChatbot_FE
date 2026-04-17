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
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { ChatHistorySidebarNew } from "./ChatHistorySidebarNew";
import { getStoredUser } from "@/lib/auth-store";
import { getProfile } from "@/lib/api/profile";
import { chat, ChatApiError, getConversationHistory, rateMessage } from "@/lib/api/chatbot";
import { listTagsActive } from "@/lib/api/tags";
import type { DocumentTagResponse } from "@/types/knowledge";

const INPUT_CHAR_LIMIT = 500;
const INPUT_WARNING_THRESHOLD = 450;

function extractAnswerFromApiError(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const answer = (data as { answer?: unknown }).answer;
  return typeof answer === "string" ? answer : "";
}

function looksLikeTooLongError(message: string): boolean {
  const normalized = message.toLowerCase();
  return normalized.includes("quá dài") || normalized.includes("too long");
}

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
  rating?: "helpful" | "not-helpful";
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

  const handleRate = async (messageId: string, rating: "helpful" | "not-helpful") => {
    console.log("🔵 Rating message:", { messageId, rating });
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg))
    );
    try {
      await rateMessage(messageId, rating);
      console.log("✅ Rating submitted successfully");
    } catch (e) {
      console.error("❌ Rating submission failed:", e);
    }
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

      // Fetch conversation history to get real message IDs from backend
      let realMessageId = (Date.now() + 1).toString(); // fallback
      if (response.conversationId) {
        try {
          console.log("🔍 Fetching conversation history for ID:", response.conversationId);
          const history = await getConversationHistory(response.conversationId);
          console.log("📥 History response:", history);
          if (history?.messages?.length) {
            console.log("📝 Total messages in history:", history.messages.length);
            // Get the last assistant message (most recent)
            const lastAssistantMsg = [...history.messages]
              .reverse()
              .find((m) => m.role === "ASSISTANT");
            console.log("🤖 Last assistant message:", lastAssistantMsg);
            // Backend uses 'messageId' field, not 'id'
            const msgId = (lastAssistantMsg as any)?.messageId || lastAssistantMsg?.id;
            if (msgId) {
              realMessageId = msgId;
              console.log("✅ Got real message ID from backend:", realMessageId);
            } else {
              console.warn("⚠️ No assistant message ID found in history");
            }
          } else {
            console.warn("⚠️ History is empty or invalid");
          }
        } catch (e) {
          console.error("❌ Failed to fetch message ID:", e);
        }
      } else {
        console.warn("⚠️ No conversationId in response");
      }

      const aiMessage: Message = {
        id: realMessageId,
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
    } catch (err) {
      if (err instanceof ChatApiError) {
        const apiAnswer = extractAnswerFromApiError(err.data) || err.message;
        if (err.status === 429) {
          setError(
            isEn
              ? "You have reached today's message limit. Please try again tomorrow."
              : "Bạn đã đạt giới hạn tin nhắn hôm nay. Vui lòng thử lại vào ngày mai."
          );
          return;
        }
        if (err.status === 400 && looksLikeTooLongError(apiAnswer)) {
          setError(
            isEn
              ? "Your message is too long. Please shorten it."
              : "Tin nhắn quá dài. Vui lòng rút ngắn nội dung."
          );
          return;
        }
      }

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
                        {message.role === "assistant" && (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleRate(message.id, "helpful")}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                message.rating === "helpful"
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                                  : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                              }`}
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {isEn ? "Helpful" : "Hữu ích"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRate(message.id, "not-helpful")}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                message.rating === "not-helpful"
                                  ? "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-300"
                                  : "border-zinc-200 bg-white text-zinc-600 hover:border-red-300 hover:bg-red-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-red-700 dark:hover:bg-red-950/30"
                              }`}
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                              {isEn ? "Not helpful" : "Không hữu ích"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading ? (
                    <div className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          {isEn ? "AI Assistant" : "Trợ lý AI"}
                        </div>
                        <div className="inline-flex min-w-60 max-w-md flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                            {isEn ? "Generating answer..." : "Đang tạo câu trả lời..."}
                          </div>
                          <div className="space-y-2">
                            <div className="h-2.5 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-2.5 w-11/12 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                            <div className="h-2.5 w-8/12 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                          </div>
                        </div>
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
                      maxLength={INPUT_CHAR_LIMIT}
                      className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent text-[15px] text-zinc-900 placeholder-zinc-500 outline-none dark:text-white dark:placeholder-zinc-400"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading || input.length > INPUT_CHAR_LIMIT}
                      className="rounded-lg bg-emerald-600 p-2.5 text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex min-h-[18px] items-center justify-between gap-3">
                    {conversationId ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{isEn ? "Memory active" : "Đã bật bộ nhớ hội thoại"}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-transparent">memory</span>
                    )}
                    <span
                      className={`text-xs ${
                        input.length > INPUT_WARNING_THRESHOLD
                          ? "text-red-500 dark:text-red-400"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {input.length}/{INPUT_CHAR_LIMIT}
                    </span>
                  </div>
                </form>
                <p className="mt-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  {isEn
                    ? "AI can make mistakes. Verify important information."
                    : "AI có thể mắc lỗi. Hãy xác minh thông tin quan trọng."}
                </p>
              </div>
            </div>
          </div>

          <aside className="sticky top-6 hidden w-md shrink-0 space-y-4 xl:block">
            <div className="rounded-2xl border border-zinc-200 bg-linear-to-b from-zinc-50 to-white p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
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

            <div className="rounded-2xl border border-zinc-200 bg-linear-to-b from-emerald-50/80 to-white p-5 shadow-sm dark:border-zinc-800 dark:from-emerald-950/20 dark:to-zinc-950">
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
