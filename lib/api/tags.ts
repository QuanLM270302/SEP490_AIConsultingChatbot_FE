import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { TAGS_BASE } from "@/lib/api/config";
import type {
  DocumentTagResponse,
  CreateDocumentTagRequest,
  UpdateDocumentTagRequest,
} from "@/types/knowledge";

/** Active tags (for dropdown when uploading document) */
export async function listTagsActive(): Promise<DocumentTagResponse[]> {
  const res = await fetchWithAuth(TAGS_BASE);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to list tags"));
  return res.json();
}

/** All tags for tenant admin manage page */
export async function listTagsManage(): Promise<DocumentTagResponse[]> {
  const res = await fetchWithAuth(`${TAGS_BASE}/manage`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to list tags"));
  return res.json();
}

export async function createTag(
  body: CreateDocumentTagRequest
): Promise<DocumentTagResponse> {
  const res = await fetchWithAuth(TAGS_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "Create failed");
  }
  return res.json();
}

export async function updateTag(
  id: string,
  body: UpdateDocumentTagRequest
): Promise<DocumentTagResponse> {
  const res = await fetchWithAuth(`${TAGS_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "Update failed");
  }
  return res.json();
}

export async function deactivateTag(id: string): Promise<void> {
  const res = await fetchWithAuth(`${TAGS_BASE}/${id}/deactivate`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Deactivate failed"));
}

export async function activateTag(id: string): Promise<void> {
  const res = await fetchWithAuth(`${TAGS_BASE}/${id}/activate`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Activate failed"));
}

export async function deleteTag(id: string): Promise<void> {
  const res = await fetchWithAuth(`${TAGS_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Delete failed"));
}
