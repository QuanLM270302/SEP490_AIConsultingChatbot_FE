/**
 * fetch with Bearer token from auth-store. On 401, tries refreshAuth() once and retries.
 * Use in client code only (reads localStorage).
 */
import { getAccessToken, getRefreshToken, refreshAuth } from "@/lib/auth-store";

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const doFetch = (authToken: string | null) => {
    const headers = new Headers(init?.headers);
    if (authToken) headers.set("Authorization", `Bearer ${authToken}`);
    return fetch(input, { ...init, headers });
  };

  let token = getAccessToken();
  let res = await doFetch(token);

  /** Access missing/expired but refresh exists — recover once (same as AuthGuard). */
  if (res.status === 401 && getRefreshToken()) {
    const ok = await refreshAuth();
    if (ok) {
      token = getAccessToken();
      if (token) res = await doFetch(token);
    }
  }
  return res;
}
