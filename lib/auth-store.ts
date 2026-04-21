import type { JwtResponse } from "@/types/auth";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";
const LOGIN_SESSION_KEY = "auth_login_session_id";

function createLoginSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ACCESS_TOKEN_KEY);
  const t = raw?.trim();
  return t && t.length > 0 ? t : null;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REFRESH_TOKEN_KEY);
  const t = raw?.trim();
  return t && t.length > 0 ? t : null;
}

export function getStoredUser(): Pick<
  JwtResponse,
  "id" | "email" | "tenantId" | "roles" | "mustChangePassword"
> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Pick<
      JwtResponse,
      "id" | "email" | "tenantId" | "roles" | "mustChangePassword"
    >;
  } catch {
    return null;
  }
}

export function getLoginSessionId(): string | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(LOGIN_SESSION_KEY)?.trim();
  return value ? value : null;
}

export function setAuth(data: JwtResponse): void {
  if (typeof window === "undefined") return;
  const access = data.accessToken?.trim() ?? "";
  const refresh = data.refreshToken?.trim() ?? "";
  if (!access || !refresh) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  const existingLoginSessionId = localStorage.getItem(LOGIN_SESSION_KEY)?.trim();
  localStorage.setItem(
    LOGIN_SESSION_KEY,
    existingLoginSessionId && existingLoginSessionId.length > 0
      ? existingLoginSessionId
      : createLoginSessionId()
  );
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: data.id,
      email: data.email,
      tenantId: data.tenantId,
      roles: data.roles,
      mustChangePassword: data.mustChangePassword,
    })
  );
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LOGIN_SESSION_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/** Refresh accessToken using refreshToken; updates storage on success. Returns true if new tokens set. */
export async function refreshAuth(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const { refreshAccessToken } = await import("@/lib/api/auth");
    const data = await refreshAccessToken(refresh);
    setAuth(data);
    return true;
  } catch {
    clearAuth();
    return false;
  }
}

/**
 * Same as refreshAuth on success, but does **not** clear the session on failure.
 * Use for background polling so a temporary network error does not log the user out.
 */
const REFRESH_FATAL_STATUSES = new Set([400, 401, 403, 404, 422, 500]);

export async function tryRefreshAuth(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const { refreshAccessToken } = await import("@/lib/api/auth");
    const data = await refreshAccessToken(refresh);
    setAuth(data);
    return true;
  } catch (e) {
    const status = typeof e === "object" && e !== null ? (e as { status?: number }).status : undefined;
    if (typeof status === "number" && REFRESH_FATAL_STATUSES.has(status)) {
      clearAuth();
    }
    return false;
  }
}
