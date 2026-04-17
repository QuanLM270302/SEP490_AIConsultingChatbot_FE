import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { TENANT_ADMIN_BASE } from "@/lib/api/config";

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  userEmail: string;
  status: "SUCCESS" | "FAILED";
  createdAt: string;
  oldValue: unknown | null;
  newValue: unknown | null;
}

export async function getAuditLogs(limit: number = 50): Promise<AuditLogEntry[]> {
  const res = await fetchWithAuth(`${TENANT_ADMIN_BASE}/audit-logs?limit=${limit}`);
  if (!res.ok) {
    throw new Error(await res.text().catch(() => "Failed to fetch audit logs"));
  }
  return res.json();
}
