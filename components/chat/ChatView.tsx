"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Sparkles, X, ExternalLink } from "lucide-react";
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
}

export function ChatView({ isHistoryOpen, onToggleHistory }: ChatViewProps) {
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
        } ${selectedSource ? "mr-96" : "mr-0"}`}>
        {/* Purple Hero Header (from old chatbot design) */}
        <ChatHeader />

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
          <div className="relative mx-auto w-full max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {messages.length === 0 ? (
              <div className="flex min-h-[560px] h-full flex-col items-center justify-center py-12">
                <div className="mb-8 flex h-18 w-18 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/30">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  {language === "en" ? "How can I help you today?" : "Tôi có thể giúp gì cho bạn?"}
                </h2>
                <p className="mb-8 text-center text-zinc-600 dark:text-zinc-400">
                  {language === "en" 
                    ? "Ask questions about policies, procedures, or any company information" 
                    : "Hỏi về chính sách, quy trình hoặc bất kỳ thông tin nào của công ty"}
                </p>

                <div className="mb-10 grid w-full gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {language === "en" ? "Policy assistant" : "Trợ lý chính sách"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {language === "en" ? "HR, IT, workflow guidance" : "HR, IT, hướng dẫn quy trình"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {language === "en" ? "Source-grounded" : "Có nguồn tham chiếu"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {language === "en" ? "Answers include related documents" : "Câu trả lời kèm tài liệu liên quan"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left dark:border-zinc-800 dark:bg-zinc-900">
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
        </div>

        {/* Input */}
        <div className="border-t border-zinc-200/90 px-6 py-5 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-3 rounded-2xl border border-zinc-300 bg-white p-3.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950">
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
                  className="flex-1 resize-none bg-transparent text-zinc-900 placeholder-zinc-500 outline-none dark:text-white dark:placeholder-zinc-400"
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

      {/* Document Preview Panel */}
      {selectedSource && (
        <aside className="fixed right-0 top-0 z-30 flex h-full w-96 flex-col border-l border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {language === "en" ? "Document Preview" : "Xem trước tài liệu"}
            </h3>
            <button
              onClick={() => setSelectedSource(null)}
              className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Document Title */}
              <div>
                <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {selectedSource.documentName}
                </h4>
                {selectedSource.confidence && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <span>{language === "en" ? "Relevance" : "Độ liên quan"}:</span>
                    <span>{Math.round(selectedSource.confidence * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Document Preview */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {language === "en" 
                    ? "This is a preview of the document content. The full document contains detailed information about company policies, procedures, and guidelines that are relevant to your question."
                    : "Đây là bản xem trước nội dung tài liệu. Tài liệu đầy đủ chứa thông tin chi tiết về chính sách, quy trình và hướng dẫn của công ty có liên quan đến câu hỏi của bạn."}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {language === "en" ? "Type" : "Loại"}:
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">PDF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {language === "en" ? "Last Updated" : "Cập nhật"}:
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {new Date().toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {language === "en" ? "Department" : "Phòng ban"}:
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">HR</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
                  <ExternalLink className="h-4 w-4" />
                  {language === "en" ? "Open Full Document" : "Mở tài liệu đầy đủ"}
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
      </div>
    </>
  );
}
