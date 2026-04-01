"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Sparkles, ExternalLink, FileText, Search, Lightbulb } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { ChatHistorySidebarNew } from "./ChatHistorySidebarNew";
import { getStoredUser } from "@/lib/auth-store";
import { getProfile } from "@/lib/api/profile";
import { ChatHeader } from "./ChatHeader";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: {
    documentName: string;
    confidence?: number;
  }[];
  timestamp: Date;
}

interface ChatViewProps {
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
  onNavigateToSearch: (query?: string) => void;
}

export function ChatView({ isHistoryOpen, onToggleHistory, onNavigateToSearch }: ChatViewProps) {
  const { language } = useLanguageStore();
  const currentUser = getStoredUser();
  const [displayName, setDisplayName] = useState(
    currentUser?.fullName?.trim() ||
      currentUser?.email?.split("@")[0] ||
      (language === "en" ? "You" : "Bạn")
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<{
    documentName: string;
    confidence?: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ 
      top: scrollRef.current.scrollHeight, 
      behavior: "smooth" 
    });
  }, [messages]);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile?.fullName?.trim()) {
          setDisplayName(profile.fullName.trim());
        }
      })
      .catch(() => {
        // Keep fallback from auth store when profile API fails.
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Replace with actual API call
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a sample AI response based on your company's internal documents. The AI assistant can help you find information, answer questions, and provide insights.",
        sources: [
          { documentName: "Employee Handbook v2.1", confidence: 0.95 },
          { documentName: "HR Policy 2024", confidence: 0.88 }
        ],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // TODO: Load chat history from API
  };

  const exampleQuestions = [
    language === "en" ? "What is the remote work policy?" : "Chính sách làm việc từ xa là gì?",
    language === "en" ? "How do I request time off?" : "Làm thế nào để xin nghỉ phép?",
    language === "en" ? "What are the company benefits?" : "Các quyền lợi của công ty là gì?",
  ];
  const userInitial = (displayName.trim()[0] || "U").toUpperCase();
  const latestAssistantSources =
    [...messages]
      .reverse()
      .find((msg) => msg.role === "assistant" && msg.sources?.length)?.sources ?? [];
  const previewSource = selectedSource ?? latestAssistantSources[0] ?? null;

  return (
    <>
      {/* Chat History Sidebar */}
      <ChatHistorySidebarNew
        isOpen={isHistoryOpen}
        onClose={onToggleHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
      />

      <div className="flex h-full bg-zinc-100 dark:bg-zinc-900">
        {/* Main Chat Area */}
        <div className={`relative flex flex-1 flex-col bg-zinc-100 transition-all duration-300 ease-in-out dark:bg-zinc-900 ${
          isHistoryOpen ? "ml-72" : "ml-0"
        }`}>
        {/* Purple Hero Header (from old chatbot design) */}
        <ChatHeader />

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-7 py-9">
          <div className="mx-auto flex w-full max-w-[1600px] items-start gap-7">
            <div className="relative mr-auto w-full max-w-6xl rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {messages.length === 0 ? (
              <div className="flex min-h-[560px] h-full flex-col items-center justify-center py-12">
                <div className="mb-8 flex h-18 w-18 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/30">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-2 text-4xl font-semibold text-zinc-900 dark:text-white">
                  {language === "en" ? "How can I help you today?" : "Tôi có thể giúp gì cho bạn?"}
                </h2>
                <p className="mb-8 text-center text-base text-zinc-600 dark:text-zinc-400">
                  {language === "en" 
                    ? "Ask questions about policies, procedures, or any company information" 
                    : "Hỏi về chính sách, quy trình hoặc bất kỳ thông tin nào của công ty"}
                </p>

                <div className="mb-10 grid w-full gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {language === "en" ? "Policy assistant" : "Trợ lý chính sách"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {language === "en" ? "HR, IT, workflow guidance" : "HR, IT, hướng dẫn quy trình"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {language === "en" ? "Source-grounded" : "Có nguồn tham chiếu"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {language === "en" ? "Answers include related documents" : "Câu trả lời kèm tài liệu liên quan"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {language === "en" ? "Fast search" : "Tìm nhanh"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {language === "en" ? "Try Search tab for direct lookup" : "Dùng tab Search để tra cứu nhanh"}
                    </p>
                  </div>
                </div>

                {/* Example questions */}
                <div className="w-full space-y-3">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {language === "en" ? "Try asking:" : "Thử hỏi:"}
                  </p>
                  {exampleQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(question)}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-left text-sm text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-5">
                    {/* Avatar */}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "user" 
                        ? "bg-zinc-200 dark:bg-zinc-700" 
                        : "bg-emerald-600"
                    }`}>
                      {message.role === "user" ? (
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{userInitial}</span>
                      ) : (
                        <Sparkles className="h-4 w-4 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {message.role === "user" 
                          ? displayName
                          : (language === "en" ? "AI Assistant" : "Trợ lý AI")}
                      </div>
                      <div className="text-zinc-900 dark:text-white">
                        {message.content}
                      </div>

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.sources.map((source, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedSource(source)}
                              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
                            >
                              <span>{source.documentName}</span>
                              {source.confidence && (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  {Math.round(source.confidence * 100)}%
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            </div>

            <aside className="sticky top-6 hidden w-[28rem] shrink-0 space-y-4 xl:block">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {language === "en" ? "Related documents" : "Tài liệu liên quan"}
                  </h3>
                </div>
                {previewSource ? (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {previewSource.documentName}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {previewSource.confidence
                          ? `${language === "en" ? "Relevance" : "Độ liên quan"}: ${Math.round(previewSource.confidence * 100)}%`
                          : language === "en"
                            ? "Reference source from latest answer"
                            : "Nguồn tham chiếu trong câu trả lời gần nhất"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateToSearch(previewSource.documentName)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {language === "en" ? "Open document" : "Mở tài liệu"}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {language === "en"
                      ? "Ask a question and the assistant will show relevant references here."
                      : "Đặt câu hỏi, trợ lý sẽ hiển thị tài liệu tham chiếu ở khu vực này."}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {language === "en" ? "Smart suggestions" : "Gợi ý thông minh"}
                  </h3>
                </div>
                <div className="space-y-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setInput(language === "en" ? "Summarize key points with sources." : "Tóm tắt ý chính và đính kèm nguồn.")}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
                  >
                    {language === "en" ? "Summarize with cited sources" : "Tóm tắt kèm nguồn trích dẫn"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInput(language === "en" ? "Compare related policies and differences." : "So sánh các chính sách liên quan và điểm khác nhau.")}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20"
                  >
                    {language === "en" ? "Compare related policies" : "So sánh chính sách liên quan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToSearch()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-zinc-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Search className="h-3.5 w-3.5" />
                    {language === "en" ? "Open Search tab for deep lookup" : "Mở mục Tìm kiếm để tra cứu sâu"}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-200/90 px-7 py-5 dark:border-zinc-800">
          <div className="mx-auto w-full max-w-[1600px]">
            <form onSubmit={handleSubmit}>
              <div className="mr-auto flex w-full max-w-6xl items-end gap-3 rounded-2xl border border-zinc-300 bg-white p-4 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950">
                <button
                  type="button"
                  className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={language === "en" 
                    ? "Ask about policies, HR, IT..." 
                    : "Hỏi về chính sách, HR, IT..."}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[15px] text-zinc-900 placeholder-zinc-500 outline-none dark:text-white dark:placeholder-zinc-400"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl bg-emerald-600 p-2.5 text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
            <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {language === "en" 
                ? "AI can make mistakes. Verify important information." 
                : "AI có thể mắc lỗi. Hãy xác minh thông tin quan trọng."}
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
