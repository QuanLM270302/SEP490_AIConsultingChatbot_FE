export function ChatHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-50">
            AI Chatbot Tư vấn Nội bộ
          </h1>
          <p className="mt-0.5 text-sm text-zinc-400">
            Đặt câu hỏi bằng tiếng Việt • RAG-powered • Dựa trên tài liệu công ty
          </p>
        </div>
      </div>
    </header>
  );
}

