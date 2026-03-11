/**
 * Route protection: map pathname to allowed roles (backend format).
 * Empty array = any authenticated role.
 */
const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
const ROLE_TENANT_ADMIN = "ROLE_TENANT_ADMIN";
const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
const ROLE_STAFF = "ROLE_STAFF";

/** Paths that don't require login (guest + general dashboard) */
export const PUBLIC_PATHS = ["/", "/login", "/forgot-password"];

/** Path -> allowed roles (empty = any authenticated) */
export const PATH_ALLOWED_ROLES: Record<string, string[]> = {
  "/": [],
  "/profile": [],
  "/subscription": [],
  "/employee": [ROLE_EMPLOYEE],
  "/tenant-admin": [ROLE_TENANT_ADMIN],
  "/super-admin": [ROLE_SUPER_ADMIN],
  "/staff": [ROLE_STAFF],
};

/** First segment of path for role check (e.g. /tenant-admin/roles -> /tenant-admin) */
export function getPathSegment(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment ? `/${segment}` : "/";
}

/** Map backend roles to default app path for that role */
export function roleToPath(roles: string[]): string {
  const role = roles[0] ?? "";
  if (role.includes("SUPER_ADMIN")) return "/super-admin";
  if (role.includes("TENANT_ADMIN")) return "/tenant-admin";
  if (role.includes("STAFF")) return "/staff";
  if (role.includes("EMPLOYEE")) return "/employee";
  return "/employee";
}

/** Check if user has at least one of the allowed roles */
export function hasAllowedRole(userRoles: string[], allowedRoles: string[]): boolean {
  if (allowedRoles.length === 0) return true;
  return userRoles.some((r) => allowedRoles.some((a) => r.includes(a)));
}
