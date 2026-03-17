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
import {
  Upload,
  Trash2,
  RotateCcw,
  Lock,
  FileText,
  History,
  X,
  ChevronDown,
} from "lucide-react";

const VISIBILITY_LABELS: Record<DocumentVisibility, string> = {
  COMPANY_WIDE: "Toàn công ty",
  SPECIFIC_DEPARTMENTS: "Theo phòng ban",
  SPECIFIC_ROLES: "Theo vai trò",
};

export function DocumentsTab() {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [deleted, setDeleted] = useState<DeletedDocumentResponse[]>([]);
  const [categories, setCategories] = useState<DocumentCategoryResponse[]>([]);
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [accessDoc, setAccessDoc] = useState<DocumentResponse | null>(null);
  const [versionDocId, setVersionDocId] = useState<string | null>(null);
  const [versions, setVersions] = useState<DocumentVersionResponse[]>([]);
  const [newVersionDocId, setNewVersionDocId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [docs, cats, activeTags] = await Promise.all([
        listDocuments(),
        listCategoriesFlat(),
        listTagsActive(),
      ]);
      setDocuments(docs);
      setCategories(cats);
      setTags(activeTags);
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
      setError("Chọn file để upload");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const categoryId = (form.elements.namedItem("categoryId") as HTMLSelectElement)?.value || undefined;
      const tagIdsRaw = (form.elements.namedItem("tagIds") as HTMLSelectElement)?.selectedOptions;
      const tagIds = tagIdsRaw ? Array.from(tagIdsRaw).map((o) => o.value) : undefined;
      const description = (form.elements.namedItem("description") as HTMLInputElement)?.value || undefined;
      const visibility = (form.elements.namedItem("visibility") as HTMLSelectElement)?.value as DocumentVisibility;
      const params: UploadDocumentParams = {
        file,
        categoryId: categoryId || null,
        tagIds: tagIds?.length ? tagIds : null,
        description: description || null,
        visibility: visibility || "COMPANY_WIDE",
      };
      await uploadDocument(params);
      form.reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload thất bại");
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
      setError(e instanceof Error ? e.message : "Cập nhật thất bại");
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được lịch sử phiên bản");
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
      setError(e instanceof Error ? e.message : "Upload phiên bản thất bại");
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
          Upload tài liệu
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
              Tags (giữ Ctrl để chọn nhiều)
            </label>
            <select
              name="tagIds"
              multiple
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {tags.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
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
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {Object.entries(VISIBILITY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400">Trạng thái embedding</th>
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
                    {doc.embeddingStatus}
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
                        title="Upload phiên bản mới"
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
            <p className="px-4 py-6 text-center text-sm text-zinc-500">Chưa có tài liệu nào. Hãy upload file phía trên.</p>
          )}
        </div>
      )}

      {/* Modal: Update access */}
      {accessDoc && (
        <UpdateAccessModal
          doc={accessDoc}
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
            <ul className="space-y-2 text-sm">
              {versions.map((v) => (
                <li key={v.versionId} className="flex justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
                  <span>Phiên bản {v.versionNumber}</span>
                  <span className="text-zinc-500">{v.versionNote || "—"}</span>
                  <span className="text-zinc-500">{new Date(v.createdAt).toLocaleString()}</span>
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
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Upload phiên bản mới</h3>
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
                <Button type="submit" variant="primary" size="md" disabled={uploading}>{uploading ? "Đang upload…" : "Upload phiên bản"}</Button>
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
  onClose,
  onSave,
}: {
  doc: DocumentResponse;
  onClose: () => void;
  onSave: (body: UpdateDocumentAccessRequest) => void;
}) {
  const [visibility, setVisibility] = useState<DocumentVisibility>(doc.visibility);
  const [depts, setDepts] = useState<string>(doc.accessibleDepartments?.join(", ") ?? "");
  const [roles, setRoles] = useState<string>(doc.accessibleRoles?.join(", ") ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body: UpdateDocumentAccessRequest = {
      visibility,
      accessibleDepartments: visibility === "SPECIFIC_DEPARTMENTS" ? depts.split(/,\s*/).map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n)) : null,
      accessibleRoles: visibility === "SPECIFIC_ROLES" ? roles.split(/,\s*/).map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n)) : null,
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
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">ID phòng ban (cách nhau bằng dấu phẩy)</label>
              <input value={depts} onChange={(e) => setDepts(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="1, 2, 3" />
            </div>
          )}
          {visibility === "SPECIFIC_ROLES" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">ID vai trò (cách nhau bằng dấu phẩy)</label>
              <input value={roles} onChange={(e) => setRoles(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="1, 2" />
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
