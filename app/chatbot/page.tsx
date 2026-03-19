"use client";

import { useState } from "react";
import type { Message } from "@/types/chat";
import { AIBoxSidebar } from "@/components/chat/AIBoxSidebar";
import { ChatHistorySidebar } from "@/components/chat/ChatHistorySidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { chat } from "@/lib/api/chatbot";
import { listCategoriesFlat } from "@/lib/api/categories";
import { listTagsActive } from "@/lib/api/tags";
import type { DocumentCategoryResponse, DocumentTagResponse } from "@/types/knowledge";
import { useEffect } from "react";

export default function ChatbotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<DocumentCategoryResponse[]>([]);
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [topK, setTopK] = useState<number>(5);

  useEffect(() => {
    Promise.all([listCategoriesFlat().catch(() => []), listTagsActive().catch(() => [])]).then(
      ([cats, activeTags]) => {
        setCategories(cats);
        setTags(activeTags);
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = currentQuestion.trim();
    if (!question) return;

    setError(null);
    setIsLoading(true);
    const userMessageId = Date.now().toString();

    try {
      const response = await chat({
        message: question,
        conversationId: conversationId ?? undefined,
        topK,
        categoryId: categoryId || undefined,
        tagIds: selectedTagIds.length ? selectedTagIds : undefined,
      });

      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const references = (response.sources ?? []).map((s) => ({
        documentId: s.documentId,
        documentName: s.fileName,
        excerpt: s.chunkContent ?? "",
        confidence: s.relevanceScore,
      }));

      const newMessage: Message = {
        id: userMessageId,
        question,
        answer: response.answer,
        references,
        timestamp: new Date(),
        rating: null,
      };

      setMessages((prev) => [newMessage, ...prev]);
      setCurrentQuestion("");
      setSelectedMessage(newMessage.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể kết nối tới chatbot. Vui lòng thử lại.";
      setError(message);
      const fallbackMessage: Message = {
        id: userMessageId,
        question,
        answer: `**Lỗi:** ${message}\n\nKiểm tra kết nối mạng hoặc liên hệ quản trị viên nếu lỗi tiếp tục.`,
        references: [],
        timestamp: new Date(),
        rating: null,
      };
      setMessages((prev) => [fallbackMessage, ...prev]);
      setSelectedMessage(fallbackMessage.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = (messageId: string, rating: "helpful" | "not-helpful") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg))
    );
  };

  const handleSelectExample = (example: string) => {
    setCurrentQuestion(example);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <AIBoxSidebar />

      <div className="flex flex-1">
        <main className="flex flex-1 flex-col bg-zinc-950">
          <div className="flex items-center gap-3 px-6 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Quay lại</span>
            </button>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900"
            >
              Lịch sử chat
            </button>
          </div>

          {error && (
            <div className="mx-6 mt-3 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <ChatHeader />

          <div className="mx-6 mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              RAG Filters
            </p>
            <div className="grid gap-3 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-400">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                >
                  <option value="">Tất cả category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">Top K</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={topK}
                  onChange={(e) => setTopK(Math.min(20, Math.max(1, Number(e.target.value) || 5)))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-400">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((t) => {
                    const active = selectedTagIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTag(t.id)}
                        className={`rounded-full px-2.5 py-1 text-xs transition ${
                          active
                            ? "bg-green-500 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <ChatMessageList
              messages={messages}
              selectedMessage={selectedMessage}
              onSelectExample={handleSelectExample}
              onRate={handleRate}
            />
          </div>

          <ChatInput
            value={currentQuestion}
            onChange={setCurrentQuestion}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </main>
      </div>

      <ChatHistorySidebar
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectChat={(chatId) => {
          setCurrentChatId(chatId || null);
        }}
        currentChatId={currentChatId}
      />
    </div>
  );
}
