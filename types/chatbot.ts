/** Request: POST /api/v1/chatbot/chat */
export interface ChatRequest {
  message: string;
  conversationId?: string | null;
  topK?: number | null;
  categoryId?: string | null;
  tagIds?: string[] | null;
}

/** Source from RAG (one chunk) */
export interface ChatSourceDocument {
  documentId: string;
  fileName: string;
  chunkContent: string;
  chunkIndex?: number;
  relevanceScore: number;
}

/** Response: POST /api/v1/chatbot/chat */
export interface ChatResponse {
  answer: string;
  conversationId: string;
  sources: ChatSourceDocument[];
  responseTimeMs: number;
}
