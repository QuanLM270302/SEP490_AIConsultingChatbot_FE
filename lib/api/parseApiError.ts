/**
 * Backend often returns JSON bodies like `{"code":"FORBIDDEN","message":"Access Denied"}`.
 * Normalize them into readable text so UI never shows raw JSON.
 */

function textOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function collectFromArray(values: unknown[]): string | null {
  const parts = values
    .map((entry) => extractMessageFromUnknown(entry))
    .filter((entry): entry is string => !!entry);
  if (parts.length === 0) return null;
  return parts.join("; ");
}

function extractValidationErrors(obj: Record<string, unknown>): string | null {
  const errors = obj.errors;
  if (!Array.isArray(errors) || errors.length === 0) return null;
  return collectFromArray(errors);
}

function extractMessageFromObject(obj: Record<string, unknown>): string | null {
  const candidates = [
    obj.message,
    obj.error,
    obj.detail,
    obj.details,
    obj.reason,
    obj.description,
    obj.answer,
    obj.title,
  ];

  for (const candidate of candidates) {
    const parsed = extractMessageFromUnknown(candidate);
    if (parsed) return parsed;
  }

  const validation = extractValidationErrors(obj);
  if (validation) return validation;

  const code = textOrNull(obj.code);
  if (code) {
    if (code.toUpperCase() === "UNAUTHORIZED") {
      return "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.";
    }
    if (code.toUpperCase() === "FORBIDDEN") {
      return "Bạn không có quyền thực hiện thao tác này.";
    }
    if (code.toUpperCase() === "TOO_MANY_REQUESTS") {
      return "Bạn đã vượt quá giới hạn tần suất, vui lòng thử lại sau.";
    }
    return code;
  }

  return null;
}

function extractMessageFromUnknown(value: unknown): string | null {
  const asText = textOrNull(value);
  if (asText) {
    if ((asText.startsWith("{") && asText.endsWith("}")) || (asText.startsWith("[") && asText.endsWith("]"))) {
      try {
        return extractMessageFromUnknown(JSON.parse(asText));
      } catch {
        return asText;
      }
    }
    return asText;
  }

  if (Array.isArray(value)) {
    return collectFromArray(value);
  }

  if (value && typeof value === "object") {
    return extractMessageFromObject(value as Record<string, unknown>);
  }

  return null;
}

export function parseApiErrorMessage(body: string): string {
  const parsed = extractMessageFromUnknown(body);
  return parsed ?? "Request failed";
}

export function toUiErrorMessage(error: unknown, fallback = "Request failed"): string {
  if (error instanceof Error) {
    return parseApiErrorMessage(error.message);
  }

  if (typeof error === "string") {
    return parseApiErrorMessage(error);
  }

  if (error && typeof error === "object") {
    const parsed = extractMessageFromUnknown(error);
    if (parsed) return parsed;
  }

  return fallback;
}

export function apiErrorLooksForbidden(body: string): boolean {
  const u = parseApiErrorMessage(body).toUpperCase();
  return (
    u.includes("FORBIDDEN") ||
    u.includes("ACCESS DENIED") ||
    u.includes('"CODE":"FORBIDDEN"')
  );
}
