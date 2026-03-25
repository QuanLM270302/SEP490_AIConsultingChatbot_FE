import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { ADMIN_BASE, STAFF_BASE } from "@/lib/api/config";

export type SystemStatusUi = "Healthy" | "Unhealthy" | "Unknown";

export type TenantBlock = {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  activePercentage: number;
};

/** Normalized dashboard row for super-admin UI (after role-specific mapping). */
export type ParsedPlatformDashboard = {
  systemStatus: SystemStatusUi;
  /** Raw label from API when present (e.g. "Ổn định"); UI may still map to translated strings. */
  systemStatusLabelRaw: string;
  tenants: TenantBlock;
  /** SUPER_ADMIN: platform user count from totalUsers. Meaningless for STAFF — use tenants.active instead. */
  adminPlatformUsers: number;
  /** Admin: document count from API (several possible shapes). */
  adminDocumentsTotal: number;
  /** Admin: total AI queries or similar from llmUsage. */
  adminLlmQueriesTotal: number;
  /** Staff: subscriptions.total */
  staffSubscriptionsTotal: number;
  /** Staff: totalDocuments */
  staffTotalDocuments: number;
};

function safeNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeStatusText(input: unknown): string {
  return String(input ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

/**
 * Parses GET /admin/analytics/dashboard or GET /staff/analytics/dashboard JSON.
 * `totalUsers` must be interpreted only via `isStaff` (see BE contract).
 */
export function parsePlatformDashboardJson(
  isStaff: boolean,
  data: Record<string, unknown>
): ParsedPlatformDashboard {
  const tenants = (data.tenants ?? {}) as Record<string, unknown>;
  const system = (data.system ?? {}) as Record<string, unknown>;
  const documents = (data.documents ?? {}) as Record<string, unknown>;
  const llmUsage = (data.llmUsage ?? {}) as Record<string, unknown>;
  const subscriptions =
    typeof data.subscriptions === "object" && data.subscriptions !== null
      ? (data.subscriptions as Record<string, unknown>)
      : {};

  const tenantBlock: TenantBlock = {
    total: safeNum(tenants.total),
    active: safeNum(tenants.active),
    pending: safeNum(tenants.pending),
    suspended: safeNum(tenants.suspended),
    activePercentage: safeNum(tenants.activePercentage),
  };

  const statusCode = normalizeStatusText(system.status);
  const statusLabelRaw = String(
    system.statusLabel ?? system.status ?? data.statusLabel ?? data.status ?? ""
  ).trim();

  const statusRaw = normalizeStatusText(
    system.statusLabel ??
      system.status ??
      data.systemStatus ??
      data.statusLabel ??
      data.status ??
      (data.health as Record<string, unknown> | undefined)?.statusLabel ??
      (data.health as Record<string, unknown> | undefined)?.status ??
      (data.systemHealth as Record<string, unknown> | undefined)?.statusLabel ??
      (data.systemHealth as Record<string, unknown> | undefined)?.status
  );

  const isHealthy =
    statusCode === "STABLE" ||
    statusRaw.includes("STABLE") ||
    statusRaw.includes("HEALTHY") ||
    statusRaw.includes("OK") ||
    statusRaw.includes("OPERATIONAL") ||
    statusRaw.includes("NORMAL") ||
    statusRaw.includes("UP") ||
    statusRaw.includes("ỔN");

  const isUnhealthy =
    statusCode === "DEGRADED" ||
    statusRaw.includes("DEGRADED") ||
    statusRaw.includes("UNHEALTHY") ||
    statusRaw.includes("UNSTABLE") ||
    statusRaw.includes("PARTIAL") ||
    statusRaw.includes("DOWN") ||
    statusRaw.includes("ERROR") ||
    statusRaw.includes("BAD") ||
    statusRaw.includes("KHÔNG");

  const systemStatus: SystemStatusUi = isHealthy
    ? "Healthy"
    : isUnhealthy
      ? "Unhealthy"
      : "Unknown";

  const adminDocumentsTotal = isStaff
    ? 0
    : safeNum(documents.totalDocuments) ||
      safeNum(documents.total) ||
      safeNum(data.totalDocuments) ||
      safeNum((data.documentStats as Record<string, unknown> | undefined)?.total);

  const adminLlmQueriesTotal = isStaff
    ? 0
    : safeNum(llmUsage.totalRequests) ||
      safeNum(llmUsage.totalQueries) ||
      safeNum(llmUsage.queries) ||
      safeNum(llmUsage.total) ||
      safeNum(data.totalAiQueries);

  /** Staff API reuses key `totalUsers` for active org count — never treat as platform users. */
  const adminPlatformUsers = isStaff ? 0 : safeNum(data.totalUsers);

  const staffSubscriptionsTotal = isStaff ? safeNum(subscriptions.total) : 0;

  const staffTotalDocuments = isStaff ? safeNum(data.totalDocuments) : 0;

  return {
    systemStatus,
    systemStatusLabelRaw: statusLabelRaw,
    tenants: tenantBlock,
    adminPlatformUsers,
    adminDocumentsTotal,
    adminLlmQueriesTotal,
    staffSubscriptionsTotal,
    staffTotalDocuments,
  };
}

export async function fetchPlatformDashboard(isStaff: boolean): Promise<{
  ok: boolean;
  data: Record<string, unknown>;
}> {
  const endpoint = isStaff
    ? `${STAFF_BASE}/analytics/dashboard`
    : `${ADMIN_BASE}/analytics/dashboard`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetchWithAuth(endpoint, { signal: controller.signal });
    if (!res.ok) {
      console.error("Platform dashboard fetch failed");
      return { ok: false, data: {} };
    }
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: true, data };
  } catch (err) {
    console.error("Platform dashboard fetch failed:", err);
    return { ok: false, data: {} };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Staff: headline number for sidebar = active organizations only (prefer tenants.active; never show admin semantics for totalUsers).
 */
export function staffActiveOrganizationsCount(parsed: ParsedPlatformDashboard): number {
  return parsed.tenants.active;
}
