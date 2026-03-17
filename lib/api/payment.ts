import { fetchWithAuth } from "./fetchWithAuth";
import { PAYMENT_BASE } from "./config";

export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED" | "EXPIRED";

export interface PaymentHistoryItem {
  payment_id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transaction_code: string;
  tier: string;
  created_at?: string;
  paid_at?: string;
  expires_at?: string;
  is_expired?: boolean;
}

/** GET /api/v1/payment/history - lịch sử thanh toán tenant */
export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  const res = await fetchWithAuth(`${PAYMENT_BASE}/history`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load payment history"));
  return res.json();
}

/** GET /api/v1/payment/status/{paymentId} - trạng thái thanh toán (polling sau select-plan) */
export async function getPaymentStatus(paymentId: string): Promise<{ status: PaymentStatus; [k: string]: unknown }> {
  const res = await fetchWithAuth(`${PAYMENT_BASE}/status/${paymentId}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to get payment status"));
  return res.json();
}
