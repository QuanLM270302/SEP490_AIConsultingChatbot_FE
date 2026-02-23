"use client";

import { useState } from "react";
import { Menu, Send, Plus, Settings, AtSign, X } from "lucide-react";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: { title: string; excerpt: string }[];
}

interface ChatMainProps {
  chatId: string | null;
  onToggleHistory: () => void;
  historyOpen: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Làm thế nào để xin nghỉ phép?",
    timestamp: "10:30",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "Để xin nghỉ phép, bạn cần làm theo các bước sau:\n\n1. Đăng nhập vào hệ thống HR\n2. Chọn mục 'Nghỉ phép' trong menu\n3. Điền form đơn xin nghỉ với thông tin: ngày bắt đầu, ngày kết thúc, lý do\n4. Gửi đơn cho quản lý trực tiếp phê duyệt\n\nThời gian phê duyệt thường là 1-2 ngày làm việc.",
    timestamp: "10:31",
    sources: [
      {
        title: "Quy trình nghỉ phép - Sổ tay nhân viên",
        excerpt: "Nhân viên cần gửi đơn xin nghỉ phép ít nhất 3 ngày trước...",
      },
    ],
  },
];

export function ChatMain({ chatId, onToggleHistory, historyOpen }: ChatMainProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(
    chatId ? mockMessages : []
  );
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Đây là câu trả lời mẫu từ AI chatbot dựa trên tài liệu nội bộ của công ty.",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sources: [
          {
            title: "Tài liệu liên quan",
            excerpt: "Thông tin được trích xuất từ tài liệu...",
          },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="relative flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header - Integrated into chat screen */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <button 
          onClick={onToggleHistory}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          {historyOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900">
            <Settings className="h-5 w-5" />
          </button>
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Create Prompt
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-2xl text-center">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Start a conversation
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Ask questions about company policies, procedures, or any internal information.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl py-8">
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-2 w-2 rounded-full bg-zinc-400"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input - Glean style */}
      <div className="px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900">
            <button className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
              <Plus className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Press @ to tag docs, people..."
              className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-500 outline-none dark:text-white dark:placeholder-zinc-400"
            />
            <button className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
              <AtSign className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 border-l border-zinc-300 pl-2 dark:border-zinc-700">
              <select className="rounded bg-transparent text-sm text-zinc-700 outline-none dark:text-zinc-300">
                <option>Company</option>
                <option>Personal</option>
              </select>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="rounded p-1 text-blue-600 hover:bg-blue-50 disabled:opacity-40 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
