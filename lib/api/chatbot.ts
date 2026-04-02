import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { CHATBOT_BASE } from "@/lib/api/config";
import type { ChatRequest, ChatResponse, ConversationSummary, ChatHistoryResponse } from "@/types/chatbot";

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

// GET /api/v1/chatbot/history
export async function getConversations(): Promise<ConversationSummary[]> {
  const res = await fetchWithAuth(`${CHATBOT_BASE}/history?page=0&size=50`);
  if (!res.ok) return [];
  const data = await res.json();
  const items: Record<string, unknown>[] = Array.isArray(data) ? data : (data.content ?? []);
  return items.map((c) => ({
    id: String(c.conversationId ?? ""),
    title: String(c.title ?? ""),
    status: String(c.status ?? ""),
    startedAt: String(c.startedAt ?? ""),
    lastMessageAt: String(c.lastMessageAt ?? ""),
    totalMessages: Number(c.totalMessages ?? 0),
  }));
}

// GET /api/v1/chatbot/history/{id}
export async function getConversationHistory(conversationId: string): Promise<ChatHistoryResponse | null> {
  const res = await fetchWithAuth(`${CHATBOT_BASE}/history/${conversationId}`);
  if (!res.ok) return null;
  return res.json();
}

// PUT /api/v1/chatbot/history/{id}/end
export async function endConversation(conversationId: string): Promise<void> {
  await fetchWithAuth(`${CHATBOT_BASE}/history/${conversationId}/end`, { method: "PUT" });
}
