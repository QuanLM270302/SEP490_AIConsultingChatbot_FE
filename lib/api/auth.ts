import { AUTH_BASE } from "./config";
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

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({})) as Record<string, unknown>;
  if (!res.ok) {
    if (typeof data.message === "string") throw new Error(data.message);
    if (typeof data.error === "string") throw new Error(data.error);
    // Validation errors: { email: "...", password: "..." }
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const first = Object.values(data).find((v) => typeof v === "string");
      if (first) throw new Error(String(first));
    }
    throw new Error("Request failed");
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
  if (typeof data.resetSessionToken !== "string" || !data.resetSessionToken.trim()) {
    throw new Error("Phản hồi server không hợp lệ: thiếu resetSessionToken.");
  }
  return data;
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
