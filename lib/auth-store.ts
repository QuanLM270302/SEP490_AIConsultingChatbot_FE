import type { JwtResponse } from "@/types/auth";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
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

export function setAuth(data: JwtResponse): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
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
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
