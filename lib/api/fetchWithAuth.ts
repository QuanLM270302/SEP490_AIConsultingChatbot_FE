/**
 * fetch with Bearer token from auth-store. On 401, tries refreshAuth() once and retries.
 * On 403, tries tryRefreshAuth() (does not clear session on failure) then retries once —
 * JWT may be stale after admin granted DOCUMENT_READ; avoids logging user out on transient errors.
 * Use in client code only (reads localStorage).
 */
import { getAccessToken, getRefreshToken, refreshAuth, tryRefreshAuth } from "@/lib/auth-store";

type RequestAttempt = "initial" | "retry-401-refresh" | "retry-403-refresh";

function isRequestObject(input: RequestInfo | URL): input is Request {
  return typeof Request !== "undefined" && input instanceof Request;
}

function resolveRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  if (isRequestObject(input)) return input.url;
  return String(input);
}

function resolveRequestMethod(input: RequestInfo | URL, init?: RequestInit): string {
  if (init?.method) return init.method.toUpperCase();
  if (isRequestObject(input)) return input.method.toUpperCase();
  return "GET";
}

function shouldLogApiDebug(): boolean {
  if (typeof window === "undefined") return false;
  const flag = process.env.NEXT_PUBLIC_API_DEBUG?.toLowerCase();
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return process.env.NODE_ENV !== "production";
}

function summarizeRequestHeaders(headers: Headers): {
  authorization?: string;
  accept?: string;
  contentType?: string;
} {
  const authorization = headers.get("Authorization");
  return {
    authorization: authorization ? "Bearer ***" : undefined,
    accept: headers.get("Accept") ?? undefined,
    contentType: headers.get("Content-Type") ?? undefined,
  };
}

function logApiRequest(
  url: string,
  method: string,
  headers: Headers,
  attempt: RequestAttempt
): void {
  if (!shouldLogApiDebug()) return;
  console.debug("[api] request", {
    url,
    method,
    attempt,
    headers: summarizeRequestHeaders(headers),
  });
}

function logApiResponse(url: string, method: string, res: Response, attempt: RequestAttempt): void {
  if (!shouldLogApiDebug()) return;
  console.debug("[api] response", {
    url,
    method,
    attempt,
    status: res.status,
    contentType: res.headers.get("content-type") ?? undefined,
    contentDisposition: res.headers.get("content-disposition") ?? undefined,
  });
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = resolveRequestUrl(input);
  const method = resolveRequestMethod(input, init);

  const doFetch = async (authToken: string | null, attempt: RequestAttempt) => {
    const headers = new Headers(
      init?.headers ?? (isRequestObject(input) ? input.headers : undefined)
    );
    if (authToken) headers.set("Authorization", `Bearer ${authToken}`);
    logApiRequest(url, method, headers, attempt);
    const response = await fetch(input, { ...init, headers });
    logApiResponse(url, method, response, attempt);
    return response;
  };

  let token = getAccessToken();
  let res = await doFetch(token, "initial");

  /** Access missing/expired but refresh exists — recover once (same as AuthGuard). */
  if (res.status === 401 && getRefreshToken()) {
    const ok = await refreshAuth();
    if (ok) {
      token = getAccessToken();
      if (token) res = await doFetch(token, "retry-401-refresh");
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
      if (token) res = await doFetch(token, "retry-403-refresh");
    }
  }
  return res;
}
