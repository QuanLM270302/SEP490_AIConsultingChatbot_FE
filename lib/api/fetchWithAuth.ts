/**
 * fetch with Bearer token from auth-store. On 401, tries refreshAuth() once and retries.
 * On 403, tries tryRefreshAuth() then retries once. Invalid refresh (4xx/5xx) clears storage;
 * pure network errors keep the session. Use in client code only (reads localStorage).
 */
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  refreshAuth,
  tryRefreshAuth,
} from "@/lib/auth-store";
import { parseApiErrorMessage } from "@/lib/api/parseApiError";
import {
  isAuthExpiredErrorMessage,
  notifyAuthSessionExpired,
} from "@/lib/auth-session-events";

type RequestAttempt = "initial" | "retry-401-refresh" | "retry-403-refresh";
const SESSION_EXPIRED_NOTIFY_DEBOUNCE_MS = 1_500;

let lastSessionExpiredNotificationAt = 0;

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
  ifNoneMatch?: string;
} {
  const authorization = headers.get("Authorization");
  return {
    authorization: authorization ? "Bearer ***" : undefined,
    accept: headers.get("Accept") ?? undefined,
    contentType: headers.get("Content-Type") ?? undefined,
    ifNoneMatch: headers.get("If-None-Match") ?? undefined,
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
    etag: res.headers.get("etag") ?? undefined,
    previewMode: res.headers.get("x-preview-mode") ?? undefined,
    sourceContentType: res.headers.get("x-source-content-type") ?? undefined,
    traceId: res.headers.get("x-trace-id") ?? undefined,
  });
}

async function readErrorMessage(response: Response): Promise<string | undefined> {
  try {
    const raw = await response.clone().text();
    if (!raw || !raw.trim()) return undefined;
    return parseApiErrorMessage(raw);
  } catch {
    return undefined;
  }
}

async function handleFinalUnauthorizedResponse(
  response: Response,
  url: string,
  method: string
): Promise<void> {
  if (typeof window === "undefined") return;
  if (response.status !== 401 && response.status !== 403) return;

  const now = Date.now();
  if (now - lastSessionExpiredNotificationAt < SESSION_EXPIRED_NOTIFY_DEBOUNCE_MS) {
    return;
  }

  const message = await readErrorMessage(response);

  const shouldNotifyByStatus = response.status === 401;
  const shouldNotifyByMessage =
    response.status === 403 &&
    (!!message && isAuthExpiredErrorMessage(message));

  if (!shouldNotifyByStatus && !shouldNotifyByMessage) {
    return;
  }

  clearAuth();
  lastSessionExpiredNotificationAt = now;
  notifyAuthSessionExpired({
    status: response.status,
    message,
    sourceUrl: url,
    method,
  });
}

async function normalizeErrorResponseBody(response: Response): Promise<Response> {
  if (response.ok) return response;

  const raw = await response.clone().text().catch(() => "");
  if (!raw.trim()) return response;

  const normalized = parseApiErrorMessage(raw);
  if (!normalized || normalized === raw.trim()) return response;

  const headers = new Headers(response.headers);
  headers.set("content-type", "text/plain; charset=utf-8");

  return new Response(normalized, {
    status: response.status,
    statusText: response.statusText,
    headers,
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

  /** 403: refresh JWT from DB (e.g. new DOCUMENT_READ). tryRefreshAuth may clear session if refresh fails with HTTP error. */
  if (res.status === 403 && getRefreshToken()) {
    const ok = await tryRefreshAuth();
    if (ok) {
      token = getAccessToken();
      if (token) res = await doFetch(token, "retry-403-refresh");
    }
  }

  res = await normalizeErrorResponseBody(res);
  await handleFinalUnauthorizedResponse(res, url, method);
  return res;
}
