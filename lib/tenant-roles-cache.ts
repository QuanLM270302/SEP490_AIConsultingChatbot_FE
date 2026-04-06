import type { RoleResponse } from "@/lib/api/tenant-admin";

const STORAGE_KEY = "ic_consultant_tenant_roles_v1";

type RolesStore = Record<string, RoleResponse[]>;

function readAll(): RolesStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    return p && typeof p === "object" && !Array.isArray(p) ? (p as RolesStore) : {};
  } catch {
    return {};
  }
}

/** Đọc snapshot roles đã lưu cho tenant (không xóa khi đăng xuất). */
export function readTenantRolesCache(tenantId: string | null | undefined): RoleResponse[] | null {
  if (!tenantId) return null;
  const list = readAll()[tenantId];
  return Array.isArray(list) && list.length > 0 ? list : null;
}

/** Lưu snapshot sau mỗi lần tải/cập nhật thành công. */
export function writeTenantRolesCache(tenantId: string | null | undefined, roles: RoleResponse[]): void {
  if (typeof window === "undefined" || !tenantId) return;
  const all = readAll();
  all[tenantId] = roles;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* quota / private mode */
  }
}

const FIXED_ROLE_CODES = new Set(["TENANT_ADMIN", "EMPLOYEE"]);

export type RolesFilterMode = "all" | "custom" | "fixed";

/**
 * Gộp API + cache: ưu tiên bản từ API theo `id`; thêm từ cache nếu `id` chưa có trong API.
 * Với tab custom/fixed chỉ bổ sung đúng loại (theo mã role cố định).
 */
export function mergeRolesWithCache(
  apiRoles: RoleResponse[],
  cached: RoleResponse[] | null,
  mode: RolesFilterMode = "all"
): RoleResponse[] {
  if (!cached?.length) return apiRoles;
  const byId = new Map<number, RoleResponse>();
  for (const r of apiRoles) {
    if (r.id > 0) byId.set(r.id, r);
  }
  for (const c of cached) {
    if (c.id <= 0) continue;
    const code = (c.code ?? "").toUpperCase();
    if (mode === "custom" && FIXED_ROLE_CODES.has(code)) continue;
    if (mode === "fixed" && !FIXED_ROLE_CODES.has(code)) continue;
    if (!byId.has(c.id)) byId.set(c.id, c);
  }
  return Array.from(byId.values()).sort((a, b) => a.id - b.id);
}
