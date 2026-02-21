import { PROFILE_BASE } from "./config";
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/profile";
import type { MessageResponse } from "@/types/auth";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function handleResponse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    if (typeof data.message === "string") throw new Error(data.message);
    if (typeof data.error === "string") throw new Error(data.error);
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const first = Object.values(data).find((v) => typeof v === "string");
      if (first) throw new Error(String(first));
    }
    throw new Error("Request failed");
  }
  return data as T;
}

function authHeaders(accessToken: string): HeadersInit {
  return {
    ...JSON_HEADERS,
    Authorization: `Bearer ${accessToken}`,
  };
}

/** GET /api/v1/profile/me */
export async function getProfile(
  accessToken: string
): Promise<UserProfileResponse> {
  const res = await fetch(`${PROFILE_BASE}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleResponse<UserProfileResponse>(res);
}

/** PUT /api/v1/profile/update */
export async function updateProfile(
  accessToken: string,
  body: UpdateProfileRequest
): Promise<UserProfileResponse> {
  const res = await fetch(`${PROFILE_BASE}/update`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify(body),
  });
  return handleResponse<UserProfileResponse>(res);
}

/** POST /api/v1/profile/change-password */
export async function changePassword(
  accessToken: string,
  body: ChangePasswordRequest
): Promise<MessageResponse> {
  const res = await fetch(`${PROFILE_BASE}/change-password`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(body),
  });
  return handleResponse<MessageResponse>(res);
}
