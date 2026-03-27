import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { ADMIN_BASE, STAFF_BASE } from "@/lib/api/config";

export type SystemStatusUi = "Healthy" | "Unhealthy" | "Unknown";

/** GET /api/v1/admin|staff/analytics/dashboard — `system` object */
export type SystemBlock = {
  status: string;
  statusLabel: string;
  appUptimeSeconds?: number;
  appStartedAt?: string;
  checkedAt?: string;
};

/**
 * `tenants.total` = approved only (ACTIVE + SUSPENDED). Pending/rejected excluded from total.
 */
export type TenantBlock = {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  rejected: number;
  activePercentage: number;
};

export type DocumentsBlock = {
  totalDocuments: number;
  totalChunks: number;
  averageChunksPerDocument: number;
};

export type LlmUsageBlock = {
  totalTokensUsed: number;
  totalRequests: number;
  tokensThisMonth: number;
  requestsThisMonth: number;
  averageTokensPerRequest: number;
};

/**
 * Normalized dashboard after `parsePlatformDashboardJson`.
 * Root `totalUsers`: Super Admin = platform accounts (active); Staff = same value as `tenants.active` (headline).
 */
export type ParsedPlatformDashboard = {
  system: SystemBlock;
  systemStatus: SystemStatusUi;
  /** Raw label for display / tooltip */
  systemStatusLabelRaw: string;
  tenants: TenantBlock;
  subscriptions: { total: number };
  documents: DocumentsBlock;
  llmUsage: LlmUsageBlock;
  /** Raw `totalUsers` from JSON root — meaning depends on caller role */
  rootTotalUsers: number;
  /** Super Admin only: platform user count from root totalUsers */
  adminPlatformUsers: number;
  /** Raw root `totalDocuments` legacy field */
  rootTotalDocuments: number;
  /** Staff: documents total — prefer `documents.totalDocuments`, fallback root `totalDocuments` */
  staffTotalDocuments: number;
};

/** Default before load or on error (Super Admin dashboard charts). */
export const EMPTY_PARSED_PLATFORM_DASHBOARD: ParsedPlatformDashboard = {
  system: { status: "", statusLabel: "" },
  systemStatus: "Unknown",
  systemStatusLabelRaw: "",
  tenants: {
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    rejected: 0,
    activePercentage: 0,
  },
  subscriptions: { total: 0 },
  documents: { totalDocuments: 0, totalChunks: 0, averageChunksPerDocument: 0 },
  llmUsage: {
    totalTokensUsed: 0,
    totalRequests: 0,
    tokensThisMonth: 0,
    requestsThisMonth: 0,
    averageTokensPerRequest: 0,
  },
  rootTotalUsers: 0,
  adminPlatformUsers: 0,
  rootTotalDocuments: 0,
  staffTotalDocuments: 0,
};

function safeNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function safeInt(v: unknown): number {
  const n = safeNum(v);
  return Math.trunc(n);
}

function normalizeStatusText(input: unknown): string {
  return String(input ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

function parseSystem(data: Record<string, unknown>): SystemBlock {
  const system = (data.system ?? {}) as Record<string, unknown>;
  return {
    status: String(system.status ?? "").trim(),
    statusLabel: String(system.statusLabel ?? "").trim(),
    appUptimeSeconds:
      system.appUptimeSeconds !== undefined ? safeNum(system.appUptimeSeconds) : undefined,
    appStartedAt:
      typeof system.appStartedAt === "string" ? system.appStartedAt : undefined,
    checkedAt: typeof system.checkedAt === "string" ? system.checkedAt : undefined,
  };
}

function parseDocuments(
  data: Record<string, unknown>,
  isStaff: boolean
): DocumentsBlock {
  const documents = (data.documents ?? {}) as Record<string, unknown>;
  let totalDocuments =
    safeNum(documents.totalDocuments) || safeNum(documents.total) || 0;
  if (isStaff && totalDocuments === 0) {
    totalDocuments = safeNum(data.totalDocuments);
  }
  if (!isStaff && totalDocuments === 0) {
    totalDocuments =
      safeNum(data.totalDocuments) ||
      safeNum((data.documentStats as Record<string, unknown> | undefined)?.total);
  }

  return {
    totalDocuments,
    totalChunks: safeInt(documents.totalChunks),
    averageChunksPerDocument: safeInt(documents.averageChunksPerDocument),
  };
}

function parseLlmUsage(data: Record<string, unknown>): LlmUsageBlock {
  const llmUsage = (data.llmUsage ?? {}) as Record<string, unknown>;
  return {
    totalTokensUsed: safeNum(llmUsage.totalTokensUsed),
    totalRequests:
      safeNum(llmUsage.totalRequests) ||
      safeNum(llmUsage.totalQueries) ||
      safeNum(llmUsage.queries) ||
      safeNum(llmUsage.total),
    tokensThisMonth: safeNum(llmUsage.tokensThisMonth),
    requestsThisMonth: safeNum(llmUsage.requestsThisMonth),
    averageTokensPerRequest: safeNum(llmUsage.averageTokensPerRequest),
  };
}

/**
 * Parses GET /api/v1/admin/analytics/dashboard or GET /api/v1/staff/analytics/dashboard JSON.
 * `totalUsers` at root: Super Admin = platform accounts; Staff = active organizations (same as tenants.active).
 */
export function parsePlatformDashboardJson(
  isStaff: boolean,
  data: Record<string, unknown>
): ParsedPlatformDashboard {
  const tenantsRaw = (data.tenants ?? {}) as Record<string, unknown>;
  const subscriptionsRaw =
    typeof data.subscriptions === "object" && data.subscriptions !== null
      ? (data.subscriptions as Record<string, unknown>)
      : {};

  const tenantBlock: TenantBlock = {
    total: safeNum(tenantsRaw.total),
    active: safeNum(tenantsRaw.active),
    pending: safeNum(tenantsRaw.pending),
    suspended: safeNum(tenantsRaw.suspended),
    rejected: safeNum(tenantsRaw.rejected),
    activePercentage: safeNum(tenantsRaw.activePercentage),
  };

  const system = parseSystem(data);
  const statusCode = normalizeStatusText(system.status);
  const statusLabelRaw = String(
    system.statusLabel || system.status || data.statusLabel || data.status || ""
  ).trim();

  const statusRaw = normalizeStatusText(
    system.statusLabel ||
      system.status ||
      data.systemStatus ||
      data.statusLabel ||
      data.status ||
      (data.health as Record<string, unknown> | undefined)?.statusLabel ||
      (data.health as Record<string, unknown> | undefined)?.status ||
      (data.systemHealth as Record<string, unknown> | undefined)?.statusLabel ||
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

  const rootTotalUsers = safeNum(data.totalUsers);

  const documents = parseDocuments(data, isStaff);
  const llmUsage = parseLlmUsage(data);

  const adminPlatformUsers = isStaff ? 0 : rootTotalUsers;
  const rootTotalDocuments = safeNum(data.totalDocuments);
  const staffTotalDocuments = isStaff
    ? documents.totalDocuments || safeNum(data.totalDocuments)
    : 0;

  return {
    system,
    systemStatus,
    systemStatusLabelRaw: statusLabelRaw,
    tenants: tenantBlock,
    subscriptions: { total: safeNum(subscriptionsRaw.total) },
    documents,
    llmUsage,
    rootTotalUsers,
    adminPlatformUsers,
    rootTotalDocuments,
    staffTotalDocuments,
  };
}

export async function fetchPlatformDashboard(isStaff: boolean): Promise<{
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
}> {
  const endpoint = isStaff
    ? `${STAFF_BASE}/analytics/dashboard`
    : `${ADMIN_BASE}/analytics/dashboard`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetchWithAuth(endpoint, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error(`Platform dashboard fetch failed: ${res.status}`);
      return { ok: false, status: res.status, data: {} };
    }
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: true, status: res.status, data };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      console.error("Platform dashboard fetch timed out after 15s");
    } else {
      console.error("Platform dashboard fetch error:", err);
    }
    return { ok: false, status: 0, data: {} };
  }
}

/**
 * Staff sidebar headline: active organizations (prefer tenants.active).
 */
export function staffActiveOrganizationsCount(parsed: ParsedPlatformDashboard): number {
  return parsed.tenants.active;
}
