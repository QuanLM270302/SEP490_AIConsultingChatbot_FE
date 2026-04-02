import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { DOCUMENTS_BASE } from "@/lib/api/config";
import type {
  DocumentResponse,
  DeletedDocumentResponse,
  DocumentVersionResponse,
  UpdateDocumentAccessRequest,
} from "@/types/knowledge";

function apiError(res: Response, message: string): Error & { status?: number } {
  const err = new Error(message) as Error & { status?: number };
  err.status = res.status;
  return err;
}

export async function listDocuments(): Promise<DocumentResponse[]> {
  const res = await fetchWithAuth(DOCUMENTS_BASE);
  if (!res.ok) throw apiError(res, await res.text().catch(() => "Failed to list documents"));
  const data: unknown = await res.json();
  if (Array.isArray(data)) return data as DocumentResponse[];
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (Array.isArray(o.content)) return o.content as DocumentResponse[];
    if (Array.isArray(o.data)) return o.data as DocumentResponse[];
  }
  return [];
}

/** GET /api/v1/knowledge/documents/detail/{id} — full detail after visibility checks */
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
  visibility?: "COMPANY_WIDE" | "SPECIFIC_DEPARTMENTS" | "SPECIFIC_ROLES" | "SPECIFIC_DEPARTMENTS_AND_ROLES";
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
  if (!res.ok) throw apiError(res, await res.text().catch(() => "Upload version failed"));
  return res.json();
}

export type ActiveRagVersionResponse = {
  document_id: string;
  active_version_id: string | null;
  version_number?: number;
  version_note?: string | null;
  created_at?: string;
};

/** Inline file from GET .../content — text or PDF blob URL (caller must revoke PDF url). */
export async function getDocumentPreview(id: string): Promise<
  | { kind: "text"; text: string }
  | { kind: "pdf"; url: string }
  | { kind: "binary"; mime: string }
> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/${id}/content`);
  if (!res.ok) {
    throw apiError(res, await res.text().catch(() => "Failed to load document"));
  }
  const mime = res.headers.get("content-type") ?? "application/octet-stream";
  const blob = await res.blob();
  if (mime.includes("pdf")) {
    return { kind: "pdf", url: URL.createObjectURL(blob) };
  }
  if (mime.startsWith("text/") || mime.includes("json") || mime.includes("xml")) {
    return { kind: "text", text: await blob.text() };
  }
  return { kind: "binary", mime };
}

export async function downloadDocument(id: string): Promise<Blob> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/${id}/download`);
  if (!res.ok) throw apiError(res, await res.text().catch(() => "Download failed"));
  return res.blob();
}

export async function getDocumentVersionPreview(
  documentId: string,
  versionId: string
): Promise<
  | { kind: "text"; text: string }
  | { kind: "pdf"; url: string }
  | { kind: "binary"; mime: string }
> {
  const res = await fetchWithAuth(
    `${DOCUMENTS_BASE}/${documentId}/versions/${versionId}/content`
  );
  if (!res.ok) {
    throw apiError(res, await res.text().catch(() => "Failed to load version"));
  }
  const mime = res.headers.get("content-type") ?? "application/octet-stream";
  const blob = await res.blob();
  if (mime.includes("pdf")) {
    return { kind: "pdf", url: URL.createObjectURL(blob) };
  }
  if (mime.startsWith("text/") || mime.includes("json")) {
    return { kind: "text", text: await blob.text() };
  }
  return { kind: "binary", mime };
}

export async function downloadDocumentVersion(documentId: string, versionId: string): Promise<Blob> {
  const res = await fetchWithAuth(
    `${DOCUMENTS_BASE}/${documentId}/versions/${versionId}/download`
  );
  if (!res.ok) throw apiError(res, await res.text().catch(() => "Download failed"));
  return res.blob();
}

export async function getActiveRagVersion(documentId: string): Promise<ActiveRagVersionResponse> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/${documentId}/rag-version`);
  if (!res.ok) throw apiError(res, await res.text().catch(() => "Failed to load RAG version"));
  return res.json();
}

export async function setActiveRagVersion(documentId: string, versionId: string): Promise<void> {
  const res = await fetchWithAuth(`${DOCUMENTS_BASE}/${documentId}/rag-version/${versionId}`, {
    method: "PUT",
  });
  if (!res.ok) throw apiError(res, await res.text().catch(() => "Failed to set RAG version"));
}
