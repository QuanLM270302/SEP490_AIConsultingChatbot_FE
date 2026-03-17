import { fetchWithAuth } from "./fetchWithAuth";
import { ADMIN_BASE } from "./config";

// ---------- Staff (API 03) ----------
export interface StaffUser {
  id: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  roleId?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffRequest {
  email: string;
  fullName: string;
  phone?: string;
}

export async function getStaffList(): Promise<StaffUser[]> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/staff`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load staff"));
  return res.json();
}

export async function getStaffById(userId: string): Promise<StaffUser> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/staff/${userId}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Staff not found");
    throw new Error(await res.text().catch(() => "Failed to load staff"));
  }
  return res.json();
}

export async function createStaff(body: CreateStaffRequest): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to create staff");
  return data;
}

export async function activateStaff(userId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/staff/${userId}/activate`, { method: "PUT" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to activate");
  return data;
}

export async function deactivateStaff(userId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/staff/${userId}/deactivate`, { method: "PUT" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to deactivate");
  return data;
}

export async function deleteStaff(userId: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/staff/${userId}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete");
  return data;
}

// ---------- Subscription Plans (API 04) ----------
export interface SubscriptionPlanResponse {
  id: string;
  code?: string;
  name?: string;
  description?: string;
  monthlyPrice?: number;
  quarterlyPrice?: number;
  yearlyPrice?: number;
  currency?: string;
  maxUsers?: number;
  maxDocuments?: number;
  maxStorageGb?: number;
  maxApiCalls?: number;
  maxChatbotRequests?: number;
  maxRagDocuments?: number;
  maxAiTokens?: number;
  contextWindowTokens?: number;
  ragChunkSize?: number;
  aiModel?: string;
  embeddingModel?: string;
  enableRag?: boolean;
  isTrial?: boolean;
  trialDays?: number;
  isActive?: boolean;
  displayOrder?: number;
  features?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionPlanRequest {
  code: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  maxUsers: number;
  maxDocuments: number;
  maxStorageGb: number;
  maxApiCalls: number;
  maxChatbotRequests: number;
  maxRagDocuments: number;
  maxAiTokens: number;
  contextWindowTokens: number;
  ragChunkSize: number;
  aiModel?: string;
  embeddingModel?: string;
  enableRag: boolean;
  isTrial: boolean;
  trialDays?: number;
  displayOrder: number;
  features?: string;
}

export interface UpdateSubscriptionPlanRequest {
  name: string;
  description?: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  maxUsers: number;
  maxDocuments: number;
  maxStorageGb: number;
  maxApiCalls: number;
  maxChatbotRequests: number;
  maxRagDocuments: number;
  maxAiTokens: number;
  contextWindowTokens: number;
  ragChunkSize: number;
  aiModel?: string;
  embeddingModel?: string;
  enableRag: boolean;
  isActive: boolean;
  displayOrder: number;
  features?: string;
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscription-plans`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load plans"));
  return res.json();
}

export async function getActiveSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscription-plans/active`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load active plans"));
  return res.json();
}

export async function getSubscriptionPlanById(id: string): Promise<SubscriptionPlanResponse> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscription-plans/${id}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load plan"));
  return res.json();
}

export async function createSubscriptionPlan(body: CreateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscription-plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to create plan"));
  return res.json();
}

export async function updateSubscriptionPlan(id: string, body: UpdateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscription-plans/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to update plan"));
  return res.json();
}

export async function deleteSubscriptionPlan(id: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscription-plans/${id}`, { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to delete plan");
  return data;
}

// ---------- Admin Subscriptions - tenant đã mua (API 05) ----------
export interface AdminSubscriptionResponse {
  id: string;
  tenantId: string;
  tenantName?: string;
  tier?: string;
  status?: string;
  price?: number;
  currency?: string;
  billingCycle?: string;
  startDate?: string;
  endDate?: string;
  nextBillingDate?: string;
  isTrial?: boolean;
  trialEndDate?: string;
  autoRenew?: boolean;
  maxUsers?: number;
  maxDocuments?: number;
  maxStorageGb?: number;
  maxApiCalls?: number;
  maxChatbotRequests?: number;
  maxRagDocuments?: number;
  maxAiTokens?: number;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export async function getAdminSubscriptions(): Promise<AdminSubscriptionResponse[]> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscriptions`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load subscriptions"));
  return res.json();
}

export async function getActiveAdminSubscriptions(): Promise<AdminSubscriptionResponse[]> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscriptions/active`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load active subscriptions"));
  return res.json();
}

export async function getAdminSubscriptionsByTenant(tenantId: string): Promise<AdminSubscriptionResponse[]> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscriptions/tenant/${tenantId}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load tenant subscriptions"));
  return res.json();
}

export async function getAdminSubscriptionById(id: string): Promise<AdminSubscriptionResponse> {
  const res = await fetchWithAuth(`${ADMIN_BASE}/subscriptions/${id}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load subscription"));
  return res.json();
}
