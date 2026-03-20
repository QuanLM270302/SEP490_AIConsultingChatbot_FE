import { PROFILE_BASE } from "./config";
import { fetchWithAuth } from "./fetchWithAuth";
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateContactEmailRequest,
  VerifyContactEmailRequest,
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

/** GET /api/v1/profile/me — uses token from store, retries with refresh on 401 */
export async function getProfile(): Promise<UserProfileResponse> {
  const res = await fetchWithAuth(`${PROFILE_BASE}/me`, { method: "GET" });
  return handleResponse<UserProfileResponse>(res);
}

/** PUT /api/v1/profile/update */
export async function updateProfile(
  body: UpdateProfileRequest
): Promise<UserProfileResponse> {
  const res = await fetchWithAuth(`${PROFILE_BASE}/update`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  return handleResponse<UserProfileResponse>(res);
}

/** POST /api/v1/profile/change-password */
export async function changePassword(
  body: ChangePasswordRequest
): Promise<MessageResponse> {
  const res = await fetchWithAuth(`${PROFILE_BASE}/change-password`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  return handleResponse<MessageResponse>(res);
}

/** POST /api/v1/profile/contact-email/request */
export async function requestUpdateContactEmail(
  body: UpdateContactEmailRequest
): Promise<MessageResponse> {
  const res = await fetchWithAuth(`${PROFILE_BASE}/contact-email/request`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  return handleResponse<MessageResponse>(res);
}

/** POST /api/v1/profile/contact-email/verify */
export async function verifyAndUpdateContactEmail(
  body: VerifyContactEmailRequest
): Promise<MessageResponse> {
  const res = await fetchWithAuth(`${PROFILE_BASE}/contact-email/verify`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });
  return handleResponse<MessageResponse>(res);
}
