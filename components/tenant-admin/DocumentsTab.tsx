"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, useConfirmDialog } from "@/components/ui";
import {
  listDocuments,
  listDeletedDocuments,
  getDocument,
  getDocumentPreview,
  getVersionHistory,
  uploadDocument,
  uploadNewVersion,
  updateDocumentAccess,
  softDeleteDocument,
  restoreDocument,
  type UploadDocumentParams,
  type DocumentPreviewResponse,
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
  Eye,
  FileText,
  History,
  X,
  ChevronDown,
  Check,
  Calendar,
  Files,
  ShieldCheck,
  Loader2,
  CircleCheckBig,
  CircleAlert,
  Cpu,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

const VISIBILITY_LABELS: Record<DocumentVisibility, string> = {
  COMPANY_WIDE: "Toàn công ty",
  SPECIFIC_DEPARTMENTS: "Theo phòng ban",
  SPECIFIC_ROLES: "Theo vai trò",
  SPECIFIC_DEPARTMENTS_AND_ROLES: "Theo phòng ban VÀ vai trò",
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
    case "DOCUMENTS AWAITING PROCESSING":
      return t.statusPending;
    case "PROCESSING":
      return t.statusProcessing;
    case "FAILED":
      return t.statusFailed;
    default:
      return raw?.trim() || "—";
  }
}

type EmbeddingState = "completed" | "in-progress" | "failed" | "unknown";

function getEmbeddingState(raw: string | undefined): EmbeddingState {
  const key = (raw ?? "").trim().toUpperCase();
  if (!key) return "unknown";
  if (key === "COMPLETED" || key.includes("SUCCESS") || key.includes("READY")) {
    return "completed";
  }
  if (key === "FAILED" || key.includes("ERROR") || key.includes("FAIL")) {
    return "failed";
  }
  if (
    key === "PENDING" ||
    key === "PROCESSING" ||
    key.includes("PEND") ||
    key.includes("PROCESS") ||
    key.includes("QUEUE") ||
    key.includes("AWAIT")
  ) {
    return "in-progress";
  }
  return "unknown";
}

function extractCompletionTimestamp(doc: DocumentResponse): string | null {
  const raw = doc as unknown as Record<string, unknown>;
  const candidates = [
    raw.embeddingCompletedAt,
    raw.embeddingUpdatedAt,
    raw.completedAt,
    raw.lastEmbeddedAt,
    raw.updatedAt,
  ];
  for (const c of candidates) {
    if (typeof c !== "string" || c.trim().length === 0) continue;
    const d = new Date(c);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}

export function DocumentsTab({ mode = "all" }: { mode?: "all" | "upload" | "library" }) {
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
  const [detailDoc, setDetailDoc] = useState<DocumentResponse | null>(null);
  const [detailPreview, setDetailPreview] = useState<DocumentPreviewResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [embeddingModalOpen, setEmbeddingModalOpen] = useState(false);
  const [embeddingTrackDocId, setEmbeddingTrackDocId] = useState<string | null>(null);
  const [embeddingTrackFileName, setEmbeddingTrackFileName] = useState<string>("");
  const [embeddingTrackStatus, setEmbeddingTrackStatus] = useState<string>("PENDING");
  const [embeddingProgress, setEmbeddingProgress] = useState(10);
  const [embeddingCompletedAtByDocId, setEmbeddingCompletedAtByDocId] = useState<Record<string, string>>({});
  const previousEmbeddingStateRef = useRef<Record<string, EmbeddingState>>({});
  const { language } = useLanguageStore();
  const t = translations[language];
  const { confirm, confirmDialog } = useConfirmDialog();

  const updateEmbeddingCompletionTimestamps = useCallback((nextDocs: DocumentResponse[]) => {
    setEmbeddingCompletedAtByDocId((prev) => {
      const next = { ...prev };
      const seen = new Set<string>();

      for (const doc of nextDocs) {
        seen.add(doc.id);
        const state = getEmbeddingState(doc.embeddingStatus);
        const prevState = previousEmbeddingStateRef.current[doc.id];
        const serverTimestamp = extractCompletionTimestamp(doc);

        if (state === "completed") {
          if (serverTimestamp) {
            next[doc.id] = serverTimestamp;
          } else if (prevState && prevState !== "completed") {
            next[doc.id] = new Date().toISOString();
          } else if (!next[doc.id]) {
            next[doc.id] = doc.uploadedAt;
          }
        }

        if (state !== "completed" && prevState === "completed") {
          delete next[doc.id];
        }

        previousEmbeddingStateRef.current[doc.id] = state;
      }

      for (const id of Object.keys(next)) {
        if (!seen.has(id)) delete next[id];
      }

      return next;
    });
  }, []);

  const load = useCallback(async () => {
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
      updateEmbeddingCompletionTimestamps(docs);
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
  }, [updateEmbeddingCompletionTimestamps]);

  const refreshDocumentsRealtime = useCallback(async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
      updateEmbeddingCompletionTimestamps(docs);
    } catch {
      // Ignore transient polling errors and keep current UI state.
    }
  }, [updateEmbeddingCompletionTimestamps]);

  const hasInProgressEmbedding = useMemo(
    () => documents.some((d) => getEmbeddingState(d.embeddingStatus) === "in-progress"),
    [documents]
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!hasInProgressEmbedding) return;
    const id = window.setInterval(() => {
      void refreshDocumentsRealtime();
    }, 5000);
    return () => window.clearInterval(id);
  }, [hasInProgressEmbedding, refreshDocumentsRealtime]);

  useEffect(() => {
    const onFocus = () => {
      if (hasInProgressEmbedding) {
        void refreshDocumentsRealtime();
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [hasInProgressEmbedding, refreshDocumentsRealtime]);

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
        visibility === "SPECIFIC_DEPARTMENTS" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES"
          ? selectedDepartmentIds
          : null;
      const accessibleRoles =
        visibility === "SPECIFIC_ROLES" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES"
          ? selectedRoleIds
          : null;

      if (
        (visibility === "SPECIFIC_DEPARTMENTS" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") &&
        selectedDepartmentIds.length === 0
      ) {
        setError("Vui lòng chọn ít nhất 1 phòng ban.");
        setUploading(false);
        return;
      }
      if (
        (visibility === "SPECIFIC_ROLES" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") &&
        selectedRoleIds.length === 0
      ) {
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
      const uploadedDoc = await uploadDocument(params);
      form.reset();
      setSelectedTagIds([]);
      setUploadVisibility("COMPANY_WIDE");
      setSelectedDepartmentIds([]);
      setSelectedRoleIds([]);
      setEmbeddingTrackDocId(uploadedDoc.id);
      setEmbeddingTrackFileName(uploadedDoc.originalFileName || uploadedDoc.documentTitle || file.name);
      setEmbeddingTrackStatus(uploadedDoc.embeddingStatus || "PENDING");
      setEmbeddingProgress(12);
      setEmbeddingModalOpen(true);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const mapStatusToTargetProgress = (raw: string | undefined): number => {
    const state = getEmbeddingState(raw);
    if (state === "completed") return 100;
    if (state === "failed") return 100;
    if (state === "in-progress") return 72;
    return 26;
  };

  useEffect(() => {
    if (!embeddingModalOpen || !embeddingTrackDocId) return;
    const statusState = getEmbeddingState(embeddingTrackStatus);
    if (statusState === "completed" || statusState === "failed") return;

    const pollId = window.setInterval(async () => {
      try {
        const docs = await listDocuments();
        const matched = docs.find((d) => d.id === embeddingTrackDocId);
        if (!matched) return;

        setEmbeddingTrackStatus(matched.embeddingStatus || "PENDING");
        const state = getEmbeddingState(matched.embeddingStatus);
        if (state === "completed" || state === "failed") {
          setEmbeddingProgress(100);
          await load();
        }
      } catch {
        // keep existing status UI on transient polling errors
      }
    }, 2500);

    return () => window.clearInterval(pollId);
  }, [embeddingModalOpen, embeddingTrackDocId, embeddingTrackStatus, load]);

  useEffect(() => {
    if (!embeddingModalOpen) return;
    const target = mapStatusToTargetProgress(embeddingTrackStatus);
    if (embeddingProgress >= target) return;

    const tick = window.setInterval(() => {
      setEmbeddingProgress((prev) => {
        if (prev >= target) return prev;
        const step = target >= 90 ? 1 : 2;
        return Math.min(target, prev + step);
      });
    }, 70);

    return () => window.clearInterval(tick);
  }, [embeddingModalOpen, embeddingTrackStatus, embeddingProgress]);

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
    const ok = await confirm({
      title: "Xóa mềm tài liệu?",
      description: "Bạn có thể khôi phục tài liệu từ thùng rác.",
      confirmText: "Xóa mềm",
      cancelText: "Hủy",
      tone: "warning",
    });
    if (!ok) return;

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

  const handleViewDetail = async (id: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const [doc, preview] = await Promise.all([getDocument(id), getDocumentPreview(id)]);
      setDetailDoc(doc);
      setDetailPreview(preview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được chi tiết tài liệu");
    } finally {
      setDetailLoading(false);
    }
  };

  const formatFileSize = (bytes?: number | null): string => {
    if (!bytes || bytes <= 0) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit += 1;
    }
    const fractionDigits = value >= 10 || unit === 0 ? 0 : 1;
    return `${value.toFixed(fractionDigits)} ${units[unit]}`;
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

      {(mode === "all" || mode === "upload") && (
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
                if (v !== "SPECIFIC_DEPARTMENTS" && v !== "SPECIFIC_DEPARTMENTS_AND_ROLES") setSelectedDepartmentIds([]);
                if (v !== "SPECIFIC_ROLES" && v !== "SPECIFIC_DEPARTMENTS_AND_ROLES") setSelectedRoleIds([]);
              }}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {Object.entries(VISIBILITY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          {(uploadVisibility === "SPECIFIC_DEPARTMENTS" || uploadVisibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") && (
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
          {(uploadVisibility === "SPECIFIC_ROLES" || uploadVisibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") && (
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
      )}

      {(mode === "all" || mode === "library") && (
      <>
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
                    <div className="flex flex-col gap-0.5">
                      <span>{mapEmbeddingStatusLabel(doc.embeddingStatus, t)}</span>
                      {getEmbeddingState(doc.embeddingStatus) === "completed" &&
                      embeddingCompletedAtByDocId[doc.id] ? (
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {language === "en" ? "Updated" : "Cập nhật"}: {new Date(embeddingCompletedAtByDocId[doc.id]).toLocaleString(language === "en" ? "en-US" : "vi-VN")}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => void handleViewDetail(doc.id)}
                        className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
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
      </>
      )}

      {detailDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Chi tiết tài liệu
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (detailPreview?.kind === "pdf") URL.revokeObjectURL(detailPreview.url);
                  setDetailDoc(null);
                  setDetailPreview(null);
                }}
                className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                  Thông tin tài liệu
                </p>
                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {detailDoc.documentTitle || detailDoc.originalFileName}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  {detailDoc.originalFileName}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">Phạm vi:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {VISIBILITY_LABELS[detailDoc.visibility]}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <Files className="h-4 w-4 text-cyan-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">Chunks:</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {detailDoc.chunkCount ?? 0}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">{language === "en" ? "Uploaded:" : "Ngày tải:"}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {new Date(detailDoc.uploadedAt).toLocaleString(language === "en" ? "en-US" : "vi-VN")}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                  <FileText className="h-4 w-4 text-violet-500" />
                  <span className="text-zinc-500 dark:text-zinc-400">{language === "en" ? "Size:" : "Dung lượng:"}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {formatFileSize(detailDoc.fileSize)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                {language === "en" ? "Preview content" : "Nội dung xem trước"}
              </p>
              {detailLoading ? (
                <p className="text-sm text-zinc-500">{language === "en" ? "Loading preview..." : "Đang tải preview..."}</p>
              ) : detailPreview?.kind === "text" ? (
                <pre className="max-h-[45vh] overflow-auto whitespace-pre-wrap break-words text-sm leading-7 text-zinc-800 dark:text-zinc-100">
                  {detailPreview.text}
                </pre>
              ) : detailPreview?.kind === "pdf" ? (
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  <p>{language === "en" ? "Preview is PDF. Open in a new tab to view fully." : "File preview dạng PDF. Mở ở tab mới để xem đầy đủ."}</p>
                  <a
                    href={detailPreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {language === "en" ? "Open PDF" : "Mở PDF"}
                  </a>
                </div>
              ) : detailPreview?.kind === "binary" ? (
                <p className="text-sm text-zinc-500">
                  {language === "en" ? "Unsupported preview format:" : "Không hỗ trợ xem trước định dạng:"} {detailPreview.mime}
                </p>
              ) : (
                <p className="text-sm text-zinc-500">{language === "en" ? "No preview data yet." : "Chưa có dữ liệu preview."}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {embeddingModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-emerald-500/15 p-2 text-emerald-500">
                {getEmbeddingState(embeddingTrackStatus) === "completed" ? (
                  <CircleCheckBig className="h-5 w-5" />
                ) : getEmbeddingState(embeddingTrackStatus) === "failed" ? (
                  <CircleAlert className="h-5 w-5 text-red-500" />
                ) : (
                  <Cpu className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {getEmbeddingState(embeddingTrackStatus) === "completed"
                    ? language === "en" ? "Embedding completed" : "Nhúng tài liệu hoàn tất"
                    : getEmbeddingState(embeddingTrackStatus) === "failed"
                      ? language === "en" ? "Embedding failed" : "Nhúng tài liệu thất bại"
                      : language === "en" ? "Embedding in progress" : "Đang xử lý nhúng tài liệu"}
                </p>
                <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {embeddingTrackFileName}
                </p>
              </div>
            </div>

            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                {getEmbeddingState(embeddingTrackStatus) === "completed"
                  ? language === "en" ? "Completed" : "Hoàn tất"
                  : getEmbeddingState(embeddingTrackStatus) === "failed"
                    ? language === "en" ? "Failed" : "Lỗi xử lý"
                    : language === "en" ? "Running" : "Đang chạy"}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {Math.round(embeddingProgress)}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  getEmbeddingState(embeddingTrackStatus) === "failed"
                    ? "bg-red-500"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, embeddingProgress))}%` }}
              />
            </div>

            <div className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              {language === "en" ? "Status:" : "Trạng thái:"} {mapEmbeddingStatusLabel(embeddingTrackStatus, t)}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              {getEmbeddingState(embeddingTrackStatus) === "completed" ||
              getEmbeddingState(embeddingTrackStatus) === "failed" ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setEmbeddingModalOpen(false);
                    setEmbeddingTrackDocId(null);
                  }}
                >
                  {language === "en" ? "Close" : "Đóng"}
                </Button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {language === "en" ? "Tracking..." : "Đang theo dõi..."}
                </button>
              )}
            </div>
          </div>
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

      {confirmDialog}
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
    if (
      (visibility === "SPECIFIC_DEPARTMENTS" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") &&
      selectedDepartmentIds.length === 0
    ) {
      return;
    }
    if (
      (visibility === "SPECIFIC_ROLES" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") &&
      selectedRoleIds.length === 0
    ) {
      return;
    }
    const body: UpdateDocumentAccessRequest = {
      visibility,
      accessibleDepartments:
        visibility === "SPECIFIC_DEPARTMENTS" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES"
          ? selectedDepartmentIds
          : null,
      accessibleRoles:
        visibility === "SPECIFIC_ROLES" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES"
          ? selectedRoleIds
          : null,
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
          {(visibility === "SPECIFIC_DEPARTMENTS" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") && (
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
          {(visibility === "SPECIFIC_ROLES" || visibility === "SPECIFIC_DEPARTMENTS_AND_ROLES") && (
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
