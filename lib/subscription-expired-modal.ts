/**
 * Global subscription expired modal handler
 * Shows a prominent modal when API returns 403 with "Gói đăng ký" message
 */

export const SUBSCRIPTION_EXPIRED_EVENT = "subscription-expired-modal";

export interface SubscriptionExpiredDetail {
  message: string;
  onRenew?: () => void;
}

export function showSubscriptionExpiredModal(detail: SubscriptionExpiredDetail): void {
  if (typeof window === "undefined") return;
  
  const event = new CustomEvent<SubscriptionExpiredDetail>(SUBSCRIPTION_EXPIRED_EVENT, {
    detail,
  });
  window.dispatchEvent(event);
}

export function isSubscriptionExpiredError(message: string | undefined): boolean {
  if (!message) return false;
  return message.includes("Gói đăng ký") || message.includes("subscription");
}
