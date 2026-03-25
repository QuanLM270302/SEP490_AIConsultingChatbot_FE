"use client";

import { useRef, useState } from "react";
import type { Message } from "@/types/chat";
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
import { useLanguageStore } from "@/lib/language-store";
import Link from "next/link";
import { User, ChevronDown, Settings, Sun, Moon, Globe, LogOut } from "lucide-react";
import { getAccessToken, getStoredUser, clearAuth } from "@/lib/auth-store";
import { logout } from "@/lib/api/auth";
import { getProfile } from "@/lib/api/profile";
import { translations } from "@/lib/translations";
import { useAppTheme } from "@/lib/use-app-theme";

export default function ChatbotPage() {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguageStore();
  const isEn = language === "en";
  const t = translations[language];
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useAppTheme();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const currentUser = getStoredUser();
  const displayEmail = currentUser?.email ?? "superadmin@system.vn";
  const [displayName, setDisplayName] = useState(displayEmail.split("@")[0] || "Super Administrator");

  useEffect(() => {
    Promise.all([listCategoriesFlat().catch(() => []), listTagsActive().catch(() => [])]).then(
      ([cats, activeTags]) => {
        setCategories(cats);
        setTags(activeTags);
      }
    );
  }, []);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile?.fullName?.trim()) {
          setDisplayName(profile.fullName.trim());
        }
      })
      .catch(() => {
        // Keep fallback from email when profile API fails.
      });
  }, []);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!userMenuRef.current || userMenuRef.current.contains(event.target as Node)) return;
      setIsUserMenuOpen(false);
    };
    if (isUserMenuOpen) document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isUserMenuOpen]);

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
      const message = err instanceof Error
        ? err.message
        : isEn
          ? "Cannot connect to chatbot. Please try again."
          : "Không thể kết nối tới chatbot. Vui lòng thử lại.";
      setError(message);
      const fallbackMessage: Message = {
        id: userMessageId,
        question,
        answer: isEn
          ? `**Error:** ${message}\n\nPlease check your network connection or contact your administrator if the issue persists.`
          : `**Lỗi:** ${message}\n\nKiểm tra kết nối mạng hoặc liên hệ quản trị viên nếu lỗi tiếp tục.`,
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

  const handleLogout = async () => {
    const token = getAccessToken();
    try {
      if (token) await logout(token);
    } finally {
      clearAuth();
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <ChatHistorySidebar
        open={isHistoryOpen}
        onToggle={() => setIsHistoryOpen((prev) => !prev)}
        onSelectChat={(chatId) => {
          setCurrentChatId(chatId || null);
        }}
        currentChatId={currentChatId}
      />

      <div className={`flex flex-1 transition-[padding] duration-300 ${isHistoryOpen ? "lg:pl-72" : "lg:pl-14"}`}>
        <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3 px-6 pt-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>{isEn ? "Back" : "Quay lại"}</span>
              </button>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm transition ${
                  theme === "dark"
                    ? "border-emerald-500/35 bg-zinc-950/90 text-white hover:border-emerald-400 hover:bg-zinc-900"
                    : "border-emerald-500/45 bg-white text-zinc-900 hover:border-emerald-500 hover:bg-emerald-50"
                }`}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <User className="h-4 w-4" />
                </span>
                <span className={`max-w-40 truncate text-sm font-semibold ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>{displayName}</span>
                <ChevronDown className={`h-4 w-4 transition ${theme === "dark" ? "text-zinc-300" : "text-zinc-500"} ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{displayName}</p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{displayEmail}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <User className="h-4 w-4" />
                      {isEn ? "Profile" : "Hồ sơ"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <Settings className="h-4 w-4" />
                      {isEn ? "Settings" : "Cài đặt"}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      {isEn ? "Logout" : "Đăng xuất"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
              {error}
            </div>
          )}

          <ChatHeader />

          <div className="mx-6 mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">
              {isEn ? "RAG Filters" : "Bộ lọc RAG"}
            </p>
            <div className="grid gap-3 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-400">{isEn ? "Category" : "Danh mục"}</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value="">{isEn ? "All categories" : "Tất cả category"}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-400">{isEn ? "Top K" : "Top K"}</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={topK}
                  onChange={(e) => setTopK(Math.min(20, Math.max(1, Number(e.target.value) || 5)))}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-600 dark:text-zinc-400">{isEn ? "Tags" : "Thẻ"}</label>
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
                            : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{isEn ? "Settings" : "Cài đặt"}</h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  {theme === "light" ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{t.theme}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{theme === "light" ? t.lightMode : t.darkMode}</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === "dark" ? "bg-emerald-500" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{t.language}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{isEn ? "English" : "Tiếng Việt"}</p>
                  </div>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-600"
                >
                  {isEn ? "EN" : "VI"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
