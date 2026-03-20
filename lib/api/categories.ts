import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { CATEGORIES_BASE } from "@/lib/api/config";
import type {
  DocumentCategoryResponse,
  CreateDocumentCategoryRequest,
  UpdateDocumentCategoryRequest,
} from "@/types/knowledge";

export async function listCategoriesFlat(): Promise<DocumentCategoryResponse[]> {
  const res = await fetchWithAuth(CATEGORIES_BASE);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to list categories"));
  return res.json();
}

export async function listCategoriesTree(): Promise<DocumentCategoryResponse[]> {
  const res = await fetchWithAuth(`${CATEGORIES_BASE}/tree`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load tree"));
  return res.json();
}

export async function getCategory(id: string): Promise<DocumentCategoryResponse> {
  const res = await fetchWithAuth(`${CATEGORIES_BASE}/detail/${id}`);
  if (!res.ok) throw new Error(await res.text().catch(() => "Category not found"));
  return res.json();
}

export async function createCategory(
  body: CreateDocumentCategoryRequest
): Promise<DocumentCategoryResponse> {
  const res = await fetchWithAuth(`${CATEGORIES_BASE}/create`, {
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

export async function updateCategory(
  id: string,
  body: UpdateDocumentCategoryRequest
): Promise<DocumentCategoryResponse> {
  const res = await fetchWithAuth(`${CATEGORIES_BASE}/update/${id}`, {
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

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetchWithAuth(`${CATEGORIES_BASE}/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "Delete failed");
  }
}
