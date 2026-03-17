import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { CHATBOT_BASE } from "@/lib/api/config";
import type { ChatRequest, ChatResponse } from "@/types/chatbot";

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const body: Record<string, unknown> = {
    message: request.message,
    conversationId: request.conversationId ?? undefined,
    topK: request.topK ?? 5,
    categoryId: request.categoryId ?? undefined,
    tagIds: request.tagIds ?? undefined,
  };
  const res = await fetchWithAuth(`${CHATBOT_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Chat request failed"));
  return res.json();
}

export async function chatbotHealth(): Promise<string> {
  const res = await fetchWithAuth(`${CHATBOT_BASE}/health`);
  if (!res.ok) throw new Error("Chatbot health check failed");
  return res.text();
}
