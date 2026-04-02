/**
 * Backend often returns JSON bodies like `{"code":"FORBIDDEN","message":"Access Denied"}`.
 * Use this so UI shows a short message instead of raw JSON.
 */
export function parseApiErrorMessage(body: string): string {
  const t = body.trim();
  if (!t.startsWith("{")) return t || "Error";
  try {
    const o = JSON.parse(t) as { message?: string | null; code?: string | null };
    if (o.message != null && String(o.message).trim()) return String(o.message).trim();
    if (o.code != null && String(o.code).trim()) return String(o.code).trim();
  } catch {
    /* ignore */
  }
  return t;
}

export function apiErrorLooksForbidden(body: string): boolean {
  const u = body.toUpperCase();
  return (
    u.includes("FORBIDDEN") ||
    u.includes("ACCESS DENIED") ||
    u.includes('"CODE":"FORBIDDEN"')
  );
}
