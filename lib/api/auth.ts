import { AUTH_BASE } from "./config";
import type {
  LoginRequest,
  JwtResponse,
  ForgotPasswordRequest,
  MessageResponse,
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

/** POST /api/v1/auth/logout — requires Authorization: Bearer <accessToken> */
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
