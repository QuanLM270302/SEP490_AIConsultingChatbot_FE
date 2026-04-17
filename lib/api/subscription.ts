import { fetchWithAuth } from "./fetchWithAuth";
import {
  TENANT_SUBSCRIPTION_BASE,
  SUBSCRIPTIONS_BASE,
} from "./config";

export type SubscriptionTier = "STARTER" | "STANDARD" | "ENTERPRISE" | "TRIAL";
export type BillingCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED" | "TRIAL";

export interface MySubscriptionResponse {
  id: string;
  tenantId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  startDate?: string;
  endDate?: string;
  price?: number;
  currency?: string;
  billingCycle?: BillingCycle;
  isTrial?: boolean;
  trialEndDate?: string;
  maxUsers?: number;
  maxDocuments?: number;
  maxStorageGb?: number;
  maxApiCalls?: number;
  autoRenew?: boolean;
  nextBillingDate?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  paymentMethod?: string;
  lastPaymentId?: string;
  lastPaymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

export interface CurrentSubscriptionMap {
  subscription_id: string;
  tenant_id: string;
  tier: string;
  status: string;
  is_trial?: boolean;
  start_date?: string;
  end_date?: string;
  price?: number;
  currency?: string;
  billing_cycle?: string;
  auto_renew?: boolean;
  max_users?: number;
  max_documents?: number;
  max_api_calls?: number;
  [key: string]: unknown;
}

export interface SelectPlanResponse {
  payment_id: string;
  subscription_id: string;
  transaction_code: string;
  amount: number;
  currency: string;
  qr_image_url?: string;
  qr_content?: string;
  expires_at?: string;
  tier: string;
  billing_cycle: string;
  bank_account?: string;
  bank_name?: string;
  account_name?: string;
  polling_url?: string;
  polling_interval_seconds?: number;
}

export interface TrialSelectPlanResponse {
  message: string;
  subscription_id: string;
  tier: string;
  status: string;
  is_trial?: boolean;
  start_date?: string;
  end_date?: string;
}

export interface TenantSubscriptionPlanResponse {
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
  isActive?: boolean;
  displayOrder?: number;
  features?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SelectPlanApiResponse = SelectPlanResponse | TrialSelectPlanResponse;

/** GET /api/v1/tenant-subscription/my-subscription - full subscription (Tenant Admin) */
export async function getMySubscription(): Promise<MySubscriptionResponse> {
  const res = await fetchWithAuth(`${TENANT_SUBSCRIPTION_BASE}/my-subscription`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("No active subscription found");
    throw new Error(await res.text().catch(() => "Failed to load subscription"));
  }
  return res.json();
}

/** GET /api/v1/subscriptions/current - current subscription as map */
export async function getCurrentSubscription(): Promise<CurrentSubscriptionMap | null> {
  const res = await fetchWithAuth(`${SUBSCRIPTIONS_BASE}/current`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load subscription"));
  return res.json();
}

/** GET /api/v1/subscriptions/plans - active plans visible to current tenant */
export async function getAvailableSubscriptionPlans(): Promise<TenantSubscriptionPlanResponse[]> {
  const res = await fetchWithAuth(`${SUBSCRIPTIONS_BASE}/plans`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load available plans"));
  return res.json();
}

/** POST /api/v1/subscriptions/select-plan - chọn gói, trả về payment + QR */
export async function selectPlan(tier: SubscriptionTier, cycle: BillingCycle): Promise<SelectPlanApiResponse> {
  const res = await fetchWithAuth(`${SUBSCRIPTIONS_BASE}/select-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier, cycle }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Chọn gói thất bại");
  return data as SelectPlanApiResponse;
}

/** PUT /api/v1/subscriptions/cancel - hủy subscription (body: { reason }) */
export async function cancelSubscription(reason: string): Promise<{ message: string }> {
  const res = await fetchWithAuth(`${SUBSCRIPTIONS_BASE}/cancel`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Hủy gói thất bại");
  return data;
}

/** PUT /api/v1/subscriptions/auto-renew?autoRenew=true|false */
export async function toggleAutoRenew(autoRenew: boolean): Promise<{ message: string; auto_renew: boolean }> {
  const res = await fetchWithAuth(`${SUBSCRIPTIONS_BASE}/auto-renew?autoRenew=${autoRenew}`, {
    method: "PUT",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Cập nhật auto-renew thất bại");
  return data;
}
