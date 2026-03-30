"use client";

import { ADMIN_BASE } from "@/lib/api/config";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";

export type RevenueSeriesItem = {
  period: string;
  month?: number;
  label: string;
  revenue?: number | null;
  completedPayments?: number;
};

export type RevenueSummary = {
  totalRevenue: number;
  averagePerBucket: number;
  peakPeriod: string;
  peakRevenue: number;
};

export type AdminRevenueResponse = {
  currency: string;
  granularity?: "day" | "week" | "month" | string;
  bucket: "day" | "week" | "month" | string;
  from: string;
  to: string;
  series: RevenueSeriesItem[];
  summary: RevenueSummary;
  notes?: string;
};

export type RecentActivityItem = {
  id: string;
  type: string;
  severity: "info" | "warning" | "error" | string;
  message: string;
  occurredAt: string;
  actor?: { id?: string; name?: string; role?: string } | null;
  target?: { kind?: string; id?: string; name?: string } | null;
  metadata?: Record<string, unknown>;
};

export type RecentActivitiesResponse = {
  items: RecentActivityItem[];
  nextCursor: string | null;
};

function toQuery(params: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function fetchAdminRevenue(params?: {
  from?: string;
  to?: string;
  bucket?: "day" | "week" | "month";
  timezone?: string;
  currency?: string;
}): Promise<{ ok: boolean; status: number; data: AdminRevenueResponse | null }> {
  const query = toQuery({
    from: params?.from,
    to: params?.to,
    bucket: params?.bucket,
    timezone: params?.timezone,
    currency: params?.currency,
  });
  const res = await fetchWithAuth(`${ADMIN_BASE}/analytics/revenue${query}`);
  if (!res.ok) return { ok: false, status: res.status, data: null };
  const data = (await res.json().catch(() => null)) as AdminRevenueResponse | null;
  return { ok: true, status: res.status, data };
}

export async function fetchAdminRecentActivities(params?: {
  limit?: number;
  cursor?: string;
  types?: string;
  severities?: string;
}): Promise<{ ok: boolean; status: number; data: RecentActivitiesResponse | null }> {
  const query = toQuery({
    limit: params?.limit ? String(params.limit) : undefined,
    cursor: params?.cursor,
    types: params?.types,
    severities: params?.severities,
  });
  const res = await fetchWithAuth(`${ADMIN_BASE}/analytics/recent-activities${query}`);
  if (!res.ok) return { ok: false, status: res.status, data: null };
  const data = (await res.json().catch(() => null)) as RecentActivitiesResponse | null;
  return { ok: true, status: res.status, data };
}
