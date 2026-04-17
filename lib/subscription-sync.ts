import type { MySubscriptionResponse } from "@/lib/api/subscription";

export const SIDEBAR_SUBSCRIPTION_CACHE_KEY =
  "tenant-admin-sidebar-subscription-cache-v1";
export const SIDEBAR_SUBSCRIPTION_CACHE_TTL_MS = 5 * 60 * 1000;
export const TENANT_SUBSCRIPTION_UPDATED_EVENT =
  "tenant-admin:subscription-updated";

export type SidebarSubscriptionCache = {
  tenantId: string | null;
  data: MySubscriptionResponse | null;
  fetchedAt: number;
};

export type TenantSubscriptionUpdatedDetail = {
  tenantId: string | null;
  subscription: MySubscriptionResponse | null;
};

let sidebarSubscriptionMemoryCache: SidebarSubscriptionCache | null = null;

export function isFreshSidebarSubscriptionCache(
  cache: SidebarSubscriptionCache | null,
  tenantId: string | null
): cache is SidebarSubscriptionCache {
  if (!cache) return false;
  if (cache.tenantId !== tenantId) return false;
  if (!Number.isFinite(cache.fetchedAt)) return false;
  return Date.now() - cache.fetchedAt <= SIDEBAR_SUBSCRIPTION_CACHE_TTL_MS;
}

export function readSidebarSubscriptionCache(
  tenantId: string | null
): SidebarSubscriptionCache | null {
  if (isFreshSidebarSubscriptionCache(sidebarSubscriptionMemoryCache, tenantId)) {
    return sidebarSubscriptionMemoryCache;
  }
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SIDEBAR_SUBSCRIPTION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SidebarSubscriptionCache;
    if (!isFreshSidebarSubscriptionCache(parsed, tenantId)) return null;
    sidebarSubscriptionMemoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSidebarSubscriptionCache(
  tenantId: string | null,
  data: MySubscriptionResponse | null
): SidebarSubscriptionCache {
  const next: SidebarSubscriptionCache = {
    tenantId,
    data,
    fetchedAt: Date.now(),
  };
  sidebarSubscriptionMemoryCache = next;

  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(SIDEBAR_SUBSCRIPTION_CACHE_KEY, JSON.stringify(next));
    } catch {
      // Ignore cache write failures and keep UI responsive.
    }
  }

  return next;
}

export function notifyTenantSubscriptionUpdated(
  tenantId: string | null,
  subscription: MySubscriptionResponse | null
): void {
  writeSidebarSubscriptionCache(tenantId, subscription);
  if (typeof window === "undefined") return;

  const detail: TenantSubscriptionUpdatedDetail = {
    tenantId,
    subscription,
  };

  window.dispatchEvent(
    new CustomEvent<TenantSubscriptionUpdatedDetail>(
      TENANT_SUBSCRIPTION_UPDATED_EVENT,
      { detail }
    )
  );
}