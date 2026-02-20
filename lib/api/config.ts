/**
 * Backend API base URL. Use env in production.
 */
export const API_BASE_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080")
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const AUTH_BASE = `${API_BASE_URL}/api/v1/auth`;
export const PROFILE_BASE = `${API_BASE_URL}/api/v1/profile`;
