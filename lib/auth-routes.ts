/**
 * Route protection: map pathname to allowed roles (backend format).
 * Empty array = any authenticated role.
 */
const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
const ROLE_TENANT_ADMIN = "ROLE_TENANT_ADMIN";
const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
const ROLE_STAFF = "ROLE_STAFF";

/** Paths that don't require login (guest + general dashboard) */
export const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password"];

/** Path -> allowed roles (empty = any authenticated) */
export const PATH_ALLOWED_ROLES: Record<string, string[]> = {
  "/": [],
  "/profile": [],
  "/chatbot": [],
  "/chatbot-new": [],
  "/document-dashboard": [],
  "/subscription": [ROLE_TENANT_ADMIN],
  "/employee": [ROLE_EMPLOYEE, ROLE_TENANT_ADMIN],
  "/tenant-admin": [ROLE_TENANT_ADMIN],
  "/super-admin": [ROLE_SUPER_ADMIN],
  "/staff": [ROLE_STAFF],
};

/** First segment of path for role check (e.g. /tenant-admin/roles -> /tenant-admin) */
export function getPathSegment(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment ? `/${segment}` : "/";
}

/** Prefer Spring-style ROLE_* authority (JWT lists permissions after the primary role). */
function primaryRoleString(roles: string[]): string {
  const withPrefix = roles.find((r) => r.startsWith("ROLE_"));
  return withPrefix ?? roles[0] ?? "";
}

/** Map backend roles to default app path for that role */
export function roleToPath(roles: string[]): string {
  const role = primaryRoleString(roles);
  if (role.includes("SUPER_ADMIN")) return "/super-admin";
  if (role.includes("TENANT_ADMIN")) return "/tenant-admin";
  if (role.includes("STAFF")) return "/staff";
  if (role.includes("EMPLOYEE")) return "/chatbot-new";
  return "/chatbot-new";
}

/**
 * @param pathSegment - e.g. `/employee` from `getPathSegment`. When the route is the employee
 * portal but the user has a tenant custom role (only `ROLE_*` matches `roleToPath` → `/employee`),
 * they must still be allowed — otherwise `router.replace` is a no-op and AuthGuard hangs.
 */
export function hasAllowedRole(
  userRoles: string[],
  allowedRoles: string[],
  pathSegment?: string
): boolean {
  if (allowedRoles.length === 0) return true;
  if (userRoles.some((r) => allowedRoles.includes(r))) return true;
  if (pathSegment === "/employee" && roleToPath(userRoles) === "/employee") {
    return true;
  }
  return false;
}
