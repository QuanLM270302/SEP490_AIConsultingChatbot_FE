import { AUTH_BASE } from "./config";
import { isValidResetSessionToken } from "@/lib/password-policy";
import type {
  LoginRequest,
  JwtResponse,
  ForgotPasswordRequest,
  MessageResponse,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
  ResetPasswordForgotRequest,
} from "@/types/auth";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

function extractErrorMessage(data: Record<string, unknown>): string {
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }
  if (Array.isArray(data.errors)) {
    const msgs = data.errors
      .map((item) => {
        if (item && typeof item === "object" && item !== null) {
          const o = item as Record<string, unknown>;
          if (typeof o.message === "string") return o.message;
          if (typeof o.defaultMessage === "string") return o.defaultMessage;
        }
        if (typeof item === "string") return item;
        return null;
      })
      .filter((m): m is string => typeof m === "string" && m.length > 0);
    if (msgs.length) return msgs.join(" ");
  }
  const skipKeys = new Set(["timestamp", "status", "path", "error", "errors"]);
  const fieldParts: string[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (skipKeys.has(key)) continue;
    if (typeof val === "string" && val.trim()) {
      fieldParts.push(val.includes(" ") ? val : `${key}: ${val}`);
    }
  }
  if (fieldParts.length) return fieldParts.join(" ");
  const first = Object.values(data).find((v) => typeof v === "string" && String(v).trim());
  if (first) return String(first);
  return "Request failed";
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(extractErrorMessage(data));
  }
  return data as T;
}

/** POST /api/v1/auth/login */
export async function login(body: LoginRequest): Promise<JwtResponse> {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  return handleResponse<JwtResponse>(res);
}

/** POST /api/v1/auth/refresh — body: { refreshToken } */
export async function refreshAccessToken(refreshToken: string): Promise<JwtResponse> {
  const res = await fetch(`${AUTH_BASE}/refresh`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ refreshToken }),
  });
  return handleResponse<JwtResponse>(res);
}

/** POST /api/v1/auth/logout — requires Authorization: Bearer <accessToken>; server invalidates refreshToken */
export async function logout(accessToken: string): Promise<MessageResponse> {
  const res = await fetch(`${AUTH_BASE}/logout`, {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return handleResponse<MessageResponse>(res);
}

/** POST /api/v1/auth/forgot-password */
export async function forgotPassword(
  body: ForgotPasswordRequest
): Promise<MessageResponse> {
  const res = await fetch(`${AUTH_BASE}/forgot-password`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  return handleResponse<MessageResponse>(res);
}

/** POST /api/v1/auth/verify-reset-otp — bước 2; trả về resetSessionToken (hiệu lực ~10 phút) */
export async function verifyResetOtp(
  body: VerifyResetOtpRequest
): Promise<VerifyResetOtpResponse> {
  const res = await fetch(`${AUTH_BASE}/verify-reset-otp`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  const data = await handleResponse<VerifyResetOtpResponse>(res);
  const token =
    typeof data.resetSessionToken === "string" ? data.resetSessionToken.trim() : "";
  if (!token) {
    throw new Error("Phản hồi server không hợp lệ: thiếu resetSessionToken.");
  }
  if (!isValidResetSessionToken(token)) {
    throw new Error("Phản hồi server không hợp lệ: resetSessionToken không đúng định dạng UUID.");
  }
  return { ...data, resetSessionToken: token };
}

/** POST /api/v1/auth/reset-password — bước 3; chỉ resetSessionToken + newPassword (không gửi OTP) */
export async function resetPasswordForgot(
  body: ResetPasswordForgotRequest
): Promise<MessageResponse> {
  const res = await fetch(`${AUTH_BASE}/reset-password`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  return handleResponse<MessageResponse>(res);
}
