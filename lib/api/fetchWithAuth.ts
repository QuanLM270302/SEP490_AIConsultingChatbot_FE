/**
 * fetch with Bearer token from auth-store. On 401, tries refreshAuth() once and retries.
 * On 403, tries tryRefreshAuth() (does not clear session on failure) then retries once —
 * JWT may be stale after admin granted DOCUMENT_READ; avoids logging user out on transient errors.
 * Use in client code only (reads localStorage).
 */
import { getAccessToken, getRefreshToken, refreshAuth, tryRefreshAuth } from "@/lib/auth-store";

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

  /**
   * 403 often means JWT was issued before admin granted DOCUMENT_READ (or similar).
   * Refresh rebuilds authorities from DB — same as re-login without clearing session.
   * Use tryRefreshAuth so a failed refresh (e.g. network) does not wipe the session.
   */
  if (res.status === 403 && getRefreshToken()) {
    const ok = await tryRefreshAuth();
    if (ok) {
      token = getAccessToken();
      if (token) res = await doFetch(token);
    }
  }
  return res;
}
