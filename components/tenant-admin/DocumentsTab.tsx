"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import {
  listDocuments,
  listDeletedDocuments,
  getVersionHistory,
  uploadDocument,
  uploadNewVersion,
  updateDocumentAccess,
  softDeleteDocument,
  restoreDocument,
  type UploadDocumentParams,
} from "@/lib/api/documents";
import type {
  DocumentResponse,
  DeletedDocumentResponse,
  DocumentVersionResponse,
  DocumentVisibility,
  UpdateDocumentAccessRequest,
} from "@/types/knowledge";
import { listCategoriesFlat } from "@/lib/api/categories";
import { listTagsActive } from "@/lib/api/tags";
import type { DocumentCategoryResponse, DocumentTagResponse } from "@/types/knowledge";
import { getTenantActiveDepartments, getTenantRoles, type DepartmentResponse, type RoleResponse } from "@/lib/api/tenant-admin";
import {
  Upload,
  Trash2,
  RotateCcw,
  Lock,
  FileText,
  History,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

const VISIBILITY_LABELS: Record<DocumentVisibility, string> = {
  COMPANY_WIDE: "Toàn công ty",
  SPECIFIC_DEPARTMENTS: "Theo phòng ban",
  SPECIFIC_ROLES: "Theo vai trò",
};

function prettifyDocumentAccessError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("visibility_enum") && lower.includes("does not exist")) {
    return "Không thể cập nhật quyền truy cập do máy chủ chưa đồng bộ lược đồ cơ sở dữ liệu (thiếu kiểu visibility). Vui lòng kiểm tra migration/lược đồ phía máy chủ.";
  }
  return message;
}

function mapEmbeddingStatusLabel(
  raw: string | undefined,
  t: (typeof translations)["vi"]
): string {
  const key = (raw ?? "").trim().toUpperCase();
  switch (key) {
    case "COMPLETED":
      return t.statusCompleted;
    case "PENDING":
      return t.statusPending;
    case "PROCESSING":
      return t.statusProcessing;
    case "FAILED":
      return t.statusFailed;
    default:
      return raw?.trim() || "—";
  }
}

export function DocumentsTab() {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [deleted, setDeleted] = useState<DeletedDocumentResponse[]>([]);
  const [categories, setCategories] = useState<DocumentCategoryResponse[]>([]);
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [uploadVisibility, setUploadVisibility] = useState<DocumentVisibility>("COMPANY_WIDE");
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [accessDoc, setAccessDoc] = useState<DocumentResponse | null>(null);
  const [versionDocId, setVersionDocId] = useState<string | null>(null);
  const [versions, setVersions] = useState<DocumentVersionResponse[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [newVersionDocId, setNewVersionDocId] = useState<string | null>(null);
  const { language } = useLanguageStore();
  const t = translations[language];

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docs, cats, activeTags, depts, tenantRoles] = await Promise.all([
        listDocuments(),
        listCategoriesFlat(),
        listTagsActive(),
        getTenantActiveDepartments().catch(() => []),
        getTenantRoles().catch(() => []),
      ]);
      setDocuments(docs);
      setCategories(cats);
      setTags(activeTags);
      setDepartments(depts);
      setRoles(tenantRoles);
      const del = await listDeletedDocuments();
      setDeleted(del);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem("file") as HTMLInputElement)?.files?.[0];
    if (!file) {
      setError("Chọn tệp để tải lên");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const categoryId = (form.elements.namedItem("categoryId") as HTMLSelectElement)?.value || undefined;
      const tagIds = selectedTagIds;
      const description = (form.elements.namedItem("description") as HTMLInputElement)?.value || undefined;
      const visibility = uploadVisibility;
      const accessibleDepartments =
        visibility === "SPECIFIC_DEPARTMENTS" ? selectedDepartmentIds : null;
      const accessibleRoles =
        visibility === "SPECIFIC_ROLES" ? selectedRoleIds : null;

      if (visibility === "SPECIFIC_DEPARTMENTS" && selectedDepartmentIds.length === 0) {
        setError("Vui lòng chọn ít nhất 1 phòng ban.");
        setUploading(false);
        return;
      }
      if (visibility === "SPECIFIC_ROLES" && selectedRoleIds.length === 0) {
        setError("Vui lòng chọn ít nhất 1 vai trò.");
        setUploading(false);
        return;
      }
      const params: UploadDocumentParams = {
        file,
        categoryId: categoryId || null,
        tagIds: tagIds.length ? tagIds : null,
        description: description || null,
        visibility: visibility || "COMPANY_WIDE",
        accessibleDepartments,
        accessibleRoles,
      };
      await uploadDocument(params);
      form.reset();
      setSelectedTagIds([]);
      setUploadVisibility("COMPANY_WIDE");
      setSelectedDepartmentIds([]);
      setSelectedRoleIds([]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateAccess = async (id: string, body: UpdateDocumentAccessRequest) => {
    setError(null);
    try {
      await updateDocumentAccess(id, body);
      setAccessDoc(null);
      await load();
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Cập nhật thất bại";
      setError(prettifyDocumentAccessError(raw));
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Xóa mềm tài liệu này?")) return;
    setError(null);
    try {
      await softDeleteDocument(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xóa thất bại");
    }
  };

  const handleRestore = async (id: string) => {
    setError(null);
    try {
      await restoreDocument(id);
      setShowDeleted(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Khôi phục thất bại");
    }
  };

  const loadVersions = async (id: string) => {
    setVersionDocId(id);
    try {
      const v = await getVersionHistory(id);
      setVersions(v);
      setSelectedVersionId(v?.[0]?.versionId ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được lịch sử phiên bản");
      setVersions([]);
      setSelectedVersionId(null);
    }
  };

  const handleUploadNewVersion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newVersionDocId) return;
    const form = e.currentTarget;
    const file = (form.elements.namedItem("versionFile") as HTMLInputElement)?.files?.[0];
    if (!file) {
      setError("Chọn file phiên bản mới");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const versionNote = (form.elements.namedItem("versionNote") as HTMLInputElement)?.value || undefined;
      await uploadNewVersion({ documentId: newVersionDocId, file, versionNote });
      setNewVersionDocId(null);
      form.reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tải lên phiên bản thất bại");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Đang tải danh sách tài liệu…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          Tải lên tài liệu
        </h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              File (PDF, DOCX, XLSX, PPTX, TXT, MD, CSV, tối đa 50MB)
            </label>
            <input
              name="file"
              type="file"
              accept=".pdf,.docx,.xlsx,.pptx,.txt,.md,.csv"
              className="block w-full rounded-lg border border-zinc-300 bg-white text-sm dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Danh mục
            </label>
            <select
              name="categoryId"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">— Không chọn —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
              {tags.length === 0 ? (
                <span className="px-2 py-1 text-xs text-zinc-500">Chưa có thẻ.</span>
              ) : (
                tags.map((t) => {
                  const active = selectedTagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTagIds((prev) =>
                          prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]
                        );
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        active
                          ? "bg-green-500 text-white shadow-sm shadow-green-500/30"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      }`}
                      title={`${t.name} (${t.code})`}
                    >
                      {t.name} ({t.code})
                    </button>
                  );
                })
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Mô tả
            </label>
            <input
              name="description"
              type="text"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Mô tả ngắn (tùy chọn)"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Phạm vi truy cập
            </label>
            <select
              name="visibility"
              value={uploadVisibility}
              onChange={(e) => {
                const v = e.target.value as DocumentVisibility;
                setUploadVisibility(v);
                if (v !== "SPECIFIC_DEPARTMENTS") setSelectedDepartmentIds([]);
                if (v !== "SPECIFIC_ROLES") setSelectedRoleIds([]);
              }}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {Object.entries(VISIBILITY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          {uploadVisibility === "SPECIFIC_DEPARTMENTS" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Chọn phòng ban
              </label>
              <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
                {departments.length === 0 ? (
                  <span className="px-2 py-1 text-xs text-zinc-500">Chưa có phòng ban đang hoạt động.</span>
                ) : (
                  departments.map((d) => {
                    const active = selectedDepartmentIds.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setSelectedDepartmentIds((prev) =>
                            prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id]
                          );
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          active
                            ? "bg-green-500 text-white shadow-sm shadow-green-500/30"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                        title={d.name ?? String(d.id)}
                      >
                        {d.name ?? d.code ?? d.id}
                      </button>
                    );
                  })
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Đã chọn: {selectedDepartmentIds.length}
              </p>
            </div>
          )}
          {uploadVisibility === "SPECIFIC_ROLES" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Chọn vai trò
              </label>
              <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
                {roles.length === 0 ? (
                  <span className="px-2 py-1 text-xs text-zinc-500">Chưa có vai trò.</span>
                ) : (
                  roles.map((r) => {
                    const active = selectedRoleIds.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRoleIds((prev) =>
                            prev.includes(r.id) ? prev.filter((x) => x !== r.id) : [...prev, r.id]
                          );
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          active
                            ? "bg-green-500 text-white shadow-sm shadow-green-500/30"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        }`}
                        title={r.name ?? r.code ?? String(r.id)}
                      >
                        {r.name ?? r.code ?? r.id}
                      </button>
                    );
                  })
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Đã chọn: {selectedRoleIds.length}
              </p>
            </div>
          )}
          <Button type="submit" variant="primary" size="md" disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Đang upload…" : "Upload"}
          </Button>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Danh sách tài liệu ({documents.length})
        </h3>
        <button
          type="button"
          onClick={() => setShowDeleted(!showDeleted)}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          {showDeleted ? "Ẩn tài liệu đã xóa" : `Tài liệu đã xóa (${deleted.length})`}
        </button>
      </div>

      {showDeleted ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Tên / Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Đã xóa lúc</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {deleted.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">
                    {d.documentTitle || d.originalFileName}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                    {d.deletedAt ? new Date(d.deletedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(d.id)}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Khôi phục
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {deleted.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">Chưa có tài liệu nào bị xóa.</p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Tên / Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Phạm vi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {t.embeddingStatus}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-white">
                    {doc.documentTitle || doc.originalFileName}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {VISIBILITY_LABELS[doc.visibility]}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {mapEmbeddingStatusLabel(doc.embeddingStatus, t)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => loadVersions(doc.id)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        title="Lịch sử phiên bản"
                      >
                        <History className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccessDoc(doc)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        title="Cập nhật quyền truy cập"
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewVersionDocId(doc.id)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        title="Tải lên phiên bản mới"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSoftDelete(doc.id)}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Xóa mềm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {documents.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-zinc-500">Chưa có tài liệu nào. Hãy tải lên tệp phía trên.</p>
          )}
        </div>
      )}

      {/* Modal: Update access */}
      {accessDoc && (
        <UpdateAccessModal
          doc={accessDoc}
          availableDepartments={departments}
          availableRoles={roles}
          onClose={() => setAccessDoc(null)}
          onSave={(body) => handleUpdateAccess(accessDoc.id, body)}
        />
      )}

      {/* Modal: Version history */}
      {versionDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Lịch sử phiên bản</h3>
              <button type="button" onClick={() => setVersionDocId(null)} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            {versions.length > 0 && (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Chọn phiên bản
                </label>
                <div className="relative">
                  <select
                    value={selectedVersionId ?? ""}
                    onChange={(e) => setSelectedVersionId(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-10 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    {versions.map((v) => (
                      <option key={v.versionId} value={v.versionId}>
                        Phiên bản {v.versionNumber}{v.versionNote ? ` — ${v.versionNote}` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>
            )}
            <ul className="space-y-2 text-sm">
              {versions.map((v) => (
                <li
                  key={v.versionId}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedVersionId(v.versionId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedVersionId(v.versionId);
                  }}
                  className={`flex items-start justify-between gap-3 rounded-lg px-3 py-2 transition ${
                    selectedVersionId === v.versionId
                      ? "bg-green-500/10 ring-1 ring-inset ring-green-500/20"
                      : "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {selectedVersionId === v.versionId ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <span className="text-[11px]">{v.versionNumber}</span>}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        Phiên bản {v.versionNumber}
                      </div>
                      <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {v.versionNote || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(v.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modal: Upload new version */}
      {newVersionDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Tải lên phiên bản mới</h3>
              <button type="button" onClick={() => setNewVersionDocId(null)} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUploadNewVersion} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">File mới</label>
                <input name="versionFile" type="file" accept=".pdf,.docx,.xlsx,.pptx,.txt,.md,.csv" className="block w-full rounded-lg border border-zinc-300 bg-white text-sm dark:border-zinc-700 dark:bg-zinc-900" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ghi chú phiên bản</label>
                <input name="versionNote" type="text" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="Tùy chọn" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" size="md" disabled={uploading}>{uploading ? "Đang tải lên…" : "Tải lên phiên bản"}</Button>
                <Button type="button" variant="outline" size="md" onClick={() => setNewVersionDocId(null)}>Hủy</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UpdateAccessModal({
  doc,
  availableDepartments,
  availableRoles,
  onClose,
  onSave,
}: {
  doc: DocumentResponse;
  availableDepartments: DepartmentResponse[];
  availableRoles: RoleResponse[];
  onClose: () => void;
  onSave: (body: UpdateDocumentAccessRequest) => void;
}) {
  const [visibility, setVisibility] = useState<DocumentVisibility>(doc.visibility);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<number[]>(
    doc.accessibleDepartments ?? []
  );
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    doc.accessibleRoles ?? []
  );

  const toggleDepartment = (departmentId: number) => {
    setSelectedDepartmentIds((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visibility === "SPECIFIC_DEPARTMENTS" && selectedDepartmentIds.length === 0) {
      return;
    }
    if (visibility === "SPECIFIC_ROLES" && selectedRoleIds.length === 0) {
      return;
    }
    const body: UpdateDocumentAccessRequest = {
      visibility,
      accessibleDepartments:
        visibility === "SPECIFIC_DEPARTMENTS" ? selectedDepartmentIds : null,
      accessibleRoles: visibility === "SPECIFIC_ROLES" ? selectedRoleIds : null,
    };
    onSave(body);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Cập nhật quyền truy cập</h3>
          <button type="button" onClick={onClose} className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">{doc.documentTitle || doc.originalFileName}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Phạm vi</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as DocumentVisibility)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {Object.entries(VISIBILITY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          {visibility === "SPECIFIC_DEPARTMENTS" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Chọn phòng ban
              </label>
              <div className="flex flex-wrap gap-2">
                {availableDepartments.length === 0 ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Không có dữ liệu phòng ban khả dụng.
                  </p>
                ) : (
                  availableDepartments.map((dept) => {
                    const active = selectedDepartmentIds.includes(dept.id);
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => toggleDepartment(dept.id)}
                        className={`rounded-full px-3 py-1.5 text-xs transition ${
                          active
                            ? "bg-green-500 text-white"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {dept.name ?? `Department ${dept.id}`}
                      </button>
                    );
                  })
                )}
              </div>
              {selectedDepartmentIds.length === 0 && (
                <p className="mt-2 text-xs text-red-500">
                  Vui lòng chọn ít nhất 1 phòng ban.
                </p>
              )}
            </div>
          )}
          {visibility === "SPECIFIC_ROLES" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Chọn vai trò
              </label>
              <div className="flex flex-wrap gap-2">
                {availableRoles.length === 0 ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Không có dữ liệu vai trò khả dụng.
                  </p>
                ) : (
                  availableRoles.map((role) => {
                    const roleId = role.id;
                    const active = selectedRoleIds.includes(roleId);
                    return (
                      <button
                        key={roleId}
                        type="button"
                        onClick={() => toggleRole(roleId)}
                        className={`rounded-full px-3 py-1.5 text-xs transition ${
                          active
                            ? "bg-green-500 text-white"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {role.name ?? role.code ?? `Role ${roleId}`}
                      </button>
                    );
                  })
                )}
              </div>
              {selectedRoleIds.length === 0 && (
                <p className="mt-2 text-xs text-red-500">
                  Vui lòng chọn ít nhất 1 vai trò.
                </p>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="md">Lưu</Button>
            <Button type="button" variant="outline" size="md" onClick={onClose}>Hủy</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
