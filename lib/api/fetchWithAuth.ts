/**
 * fetch with Bearer token from auth-store. On 401, tries refreshAuth() once and retries.
 * Use in client code only (reads localStorage).
 */
import { getAccessToken, refreshAuth } from "@/lib/auth-store";

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = getAccessToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(input, { ...init, headers });
  if (res.status === 401 && token) {
    const ok = await refreshAuth();
    if (ok) {
      const newToken = getAccessToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        res = await fetch(input, { ...init, headers });
      }
    }
  }
  return res;
}
