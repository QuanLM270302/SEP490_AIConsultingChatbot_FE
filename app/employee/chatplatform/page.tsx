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

export default function ChatPlatformPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      question: "Làm thế nào để xin nghỉ phép?",
      answer:
        "Để xin nghỉ phép, bạn cần gửi đơn xin nghỉ phép qua hệ thống HR ít nhất **3 ngày trước ngày nghỉ**. Đơn sẽ được phê duyệt bởi quản lý trực tiếp của bạn.\n\n**Quy trình chi tiết:**\n1. Đăng nhập vào hệ thống HR Portal\n2. Chọn mục \"Xin nghỉ phép\"\n3. Điền đầy đủ thông tin: ngày bắt đầu, ngày kết thúc, lý do\n4. Gửi đơn và chờ phê duyệt\n\n**Lưu ý:** Đơn cần được gửi tối thiểu 3 ngày làm việc trước ngày nghỉ dự kiến để đảm bảo quy trình phê duyệt kịp thời.",
      references: [
        {
          documentId: "HR-POL-001",
          documentName: "Chính sách nghỉ phép",
          excerpt:
            "Nhân viên cần gửi đơn xin nghỉ phép tối thiểu 3 ngày làm việc trước ngày nghỉ dự kiến. Đơn sẽ được xem xét và phê duyệt bởi quản lý trực tiếp trong vòng 24 giờ.",
          page: 5,
          confidence: 0.95,
        },
        {
          documentId: "HR-GUIDE-002",
          documentName: "Hướng dẫn sử dụng HR Portal",
          excerpt:
            "Để xin nghỉ phép, truy cập HR Portal → Menu \"Nghỉ phép\" → Chọn \"Tạo đơn mới\" và điền đầy đủ thông tin theo form.",
          page: 12,
          confidence: 0.88,
        },
      ],
      timestamp: new Date(Date.now() - 3600000),
      rating: "helpful",
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        question: currentQuestion,
        answer:
          "Đây là câu trả lời mẫu từ AI chatbot dựa trên tài liệu công ty. Câu trả lời này được tạo ra bằng **RAG (Retrieval-Augmented Generation)** để đảm bảo độ chính xác và cập nhật.\n\n**Các điểm chính:**\n- Câu trả lời được tìm kiếm từ cơ sở tri thức nội bộ\n- Thông tin được xác thực từ tài liệu chính thức\n- Có thể xem các đoạn trích và nguồn tham khảo bên dưới",
        references: [
          {
            documentId: "DOC-001",
            documentName: "Hướng dẫn nhân viên",
            excerpt: "Đoạn trích liên quan từ tài liệu chính thức của công ty...",
            page: 12,
            confidence: 0.92,
          },
          {
            documentId: "DOC-002",
            documentName: "Quy định nội bộ",
            excerpt: "Thông tin bổ sung từ tài liệu quy định nội bộ...",
            confidence: 0.85,
          },
        ],
        timestamp: new Date(),
        rating: null,
      };
      setMessages([newMessage, ...messages]);
      setCurrentQuestion("");
      setIsLoading(false);
      setSelectedMessage(newMessage.id);
    }, 1500);
  };

  const handleRate = (messageId: string, rating: "helpful" | "not-helpful") => {
    setMessages(
      messages.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg))
    );
  };

  const handleNewChat = () => {
    setSelectedMessage(null);
    setCurrentQuestion("");
  };

  const handleSelectExample = (example: string) => {
    setCurrentQuestion(example);
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
          <ChatHeader />

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
          // Khi chọn chat khác có thể thêm logic load lịch sử sau
        }}
        currentChatId={currentChatId}
      />
    </div>
  );
}
