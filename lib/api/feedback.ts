import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { TENANT_ADMIN_BASE, ADMIN_BASE } from "@/lib/api/config";

export interface SourceChunk {
  documentId?: string;
  documentName?: string;
  fileName?: string;
  chunkId?: string;
  relevanceScore?: number;
}

export interface LowRatedResponse {
  messageId: string;
  answer: string;
  rating: number;
  createdAt: string;
  sourceChunks?: SourceChunk[];
}

export interface FeedbackAnalytics {
  totalMessages: number;
  ratedMessages: number;
  positiveRatings: number;
  negativeRatings: number;
  helpfulPercent: number;
  notHelpfulPercent: number;
  lowRatedResponses: LowRatedResponse[];
}

export interface AIOverview {
  totalMessages: number;
  ratedMessages: number;
  helpfulPercent: number;
  notHelpfulPercent: number;
}

export interface TenantPerformance {
  tenantName: string;
  totalMessages: number;
  helpfulPercent: number;
  lowPerforming: boolean;
}

export async function getTenantFeedback(limit: number = 10): Promise<FeedbackAnalytics> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/dashboard/feedback?limit=${limit}`);
  if (!res.ok) {
    throw new Error(await res.text().catch(() => "Failed to fetch feedback analytics"));
  }
  return res.json();
}

export async function getAIOverview(): Promise<AIOverview> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/analytics/ai-overview`);
  if (!res.ok) {
    throw new Error(await res.text().catch(() => "Failed to fetch AI overview"));
  }
  return res.json();
}

export async function getTenantPerformance(): Promise<TenantPerformance[]> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/analytics/tenant-performance`);
  if (!res.ok) {
    throw new Error(await res.text().catch(() => "Failed to fetch tenant performance"));
  }
  return res.json();
}
