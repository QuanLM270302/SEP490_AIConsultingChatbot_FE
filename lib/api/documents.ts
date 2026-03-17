import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { DOCUMENTS_BASE } from "@/lib/api/config";
import type {
  DocumentResponse,
  DeletedDocumentResponse,
  DocumentVersionResponse,
  UpdateDocumentAccessRequest,
} from "@/types/knowledge";

export async function listDocuments(): Promise<DocumentResponse[]> {
  const res = await fetchWithAuth(DOCUMENTS_BASE);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to list documents"));
  return res.json();
}

export async function getDocument(id: string): Promise<DocumentResponse> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/detail/${id}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Document not found"));
  return res.json();
}

export async function listDeletedDocuments(): Promise<DeletedDocumentResponse[]> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/deleted`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to list deleted"));
  return res.json();
}

export async function getVersionHistory(id: string): Promise<DocumentVersionResponse[]> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/versions/${id}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to get versions"));
  return res.json();
}

export async function updateDocumentAccess(
  id: string,
  body: UpdateDocumentAccessRequest
): Promise<DocumentResponse> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/update-access/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Update failed"));
  return res.json();
}

export async function softDeleteDocument(id: string): Promise<void> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text().catch(() => "Delete failed"));
}

export async function restoreDocument(id: string): Promise<void> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/${id}/restore`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text().catch(() => "Restore failed"));
}

export interface UploadDocumentParams {
  file: File;
  categoryId?: string | null;
  tagIds?: string[] | null;
  description?: string | null;
  visibility?: "COMPANY_WIDE" | "SPECIFIC_DEPARTMENTS" | "SPECIFIC_ROLES";
  accessibleDepartments?: number[] | null;
  accessibleRoles?: number[] | null;
}

export async function uploadDocument(params: UploadDocumentParams): Promise<DocumentResponse> {
  const form = new FormData();
  form.append("file", params.file);
  if (params.categoryId) form.append("categoryId", params.categoryId);
  if (params.tagIds?.length) params.tagIds.forEach((id) => form.append("tagIds", id));
  if (params.description != null) form.append("description", params.description);
  form.append("visibility", params.visibility ?? "COMPANY_WIDE");
  if (params.accessibleDepartments?.length) {
    params.accessibleDepartments.forEach((d) => form.append("accessibleDepartments", String(d)));
  }
  if (params.accessibleRoles?.length) {
    params.accessibleRoles.forEach((r) => form.append("accessibleRoles", String(r)));
  }
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Upload failed"));
  return res.json();
}

export interface UploadNewVersionParams {
  documentId: string;
  file: File;
  versionNote?: string | null;
  documentTitle?: string | null;
}

export async function uploadNewVersion(
  params: UploadNewVersionParams
): Promise<DocumentResponse> {
  const form = new FormData();
  form.append("file", params.file);
  if (params.versionNote != null) form.append("versionNote", params.versionNote);
  if (params.documentTitle != null) form.append("documentTitle", params.documentTitle);
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/update/${params.documentId}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Upload version failed"));
  return res.json();
}
