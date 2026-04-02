"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  FileText,
  Calendar,
  Tag,
  Loader2,
  Download,
  History,
  CheckCircle2,
  RefreshCw,
  ListFilter,
  ChevronDown,
  Eye,
  FileType,
  HardDrive,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import type { DocumentResponse } from "@/types/knowledge";
import {
  listDocuments,
  getDocument,
  getDocumentPreview,
  downloadDocument,
  getVersionHistory,
  getActiveRagVersion,
  setActiveRagVersion,
} from "@/lib/api/documents";
import { refreshAuth, tryRefreshAuth } from "@/lib/auth-store";
import type { DocumentVersionResponse } from "@/types/knowledge";
import { getProfile } from "@/lib/api/profile";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Tô sáng từng khớp (nhiều từ cách nhau bằng khoảng trắng), không phân biệt hoa thường */
function HighlightMatches({ text, query }: { text: string; query: string }) {
  const raw = query.trim();
  if (!raw) return <>{text}</>;
  const terms = raw.split(/\s+/).filter((t) => t.length > 0);
  if (terms.length === 0) return <>{text}</>;
  const pattern = terms.map((t) => escapeRegExp(t)).join("|");
  let re: RegExp;
  try {
    re = new RegExp(`(${pattern})`, "gi");
  } catch {
    return <>{text}</>;
  }
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = terms.some((t) => part.toLowerCase() === t.toLowerCase());
        return isMatch ? (
          <mark
            key={i}
            className="rounded-sm bg-emerald-400/30 px-0.5 font-semibold text-emerald-50 [box-decoration-break:clone]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

export interface SearchViewProps {
  initialQuery?: string;
}

type SortMode = "newest" | "title_az" | "title_za";

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10_240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function visibilityLabel(vis: string | undefined, en: boolean): string {
  switch (vis) {
    case "COMPANY_WIDE":
      return en ? "Company-wide" : "Toàn công ty";
    case "SPECIFIC_DEPARTMENTS":
      return en ? "Selected departments" : "Theo phòng ban";
    case "SPECIFIC_ROLES":
      return en ? "Selected roles" : "Theo vai trò";
    case "SPECIFIC_DEPARTMENTS_AND_ROLES":
      return en ? "Departments & roles" : "Phòng ban & vai trò";
    default:
      return vis ?? "—";
  }
}

function embeddingLabel(status: string | undefined, en: boolean): string {
  const u = (status ?? "").toUpperCase();
  if (u.includes("READY") || u === "COMPLETED" || u === "SUCCESS")
    return en ? "Indexed" : "Đã nhúng";
  if (u.includes("PEND") || u === "QUEUED") return en ? "Pending" : "Đang chờ";
  if (u.includes("FAIL") || u.includes("ERROR")) return en ? "Failed" : "Lỗi";
  if (u.includes("PROCESS")) return en ? "Processing" : "Đang xử lý";
  return status ?? "—";
}

export function SearchView({ initialQuery }: SearchViewProps) {
  const { language } = useLanguageStore();
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [documentsErrorStatus, setDocumentsErrorStatus] = useState<number | null>(null);
  const [selected, setSelected] = useState<DocumentResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const pdfObjectUrlRef = useRef<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [preview, setPreview] = useState<
    | { kind: "text"; text: string }
    | { kind: "pdf"; url: string }
    | { kind: "binary"; mime: string }
    | null
  >(null);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versions, setVersions] = useState<DocumentVersionResponse[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [activeRagId, setActiveRagId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [profileRoleName, setProfileRoleName] = useState<string | null>(null);
  const [detailDoc, setDetailDoc] = useState<DocumentResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  /** Background list refresh (polling / tab focus) — không che màn hình */
  const [listSyncing, setListSyncing] = useState(false);
  const debounceSyncRef = useRef<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const t = useMemo(
    () => ({
      searchPlaceholder:
        language === "en" ? "Search documents by title or tag…" : "Tìm theo tiêu đề hoặc thẻ…",
      noDocs:
        language === "en"
          ? "No documents match your search."
          : "Không có tài liệu phù hợp.",
      noAccess:
        language === "en"
          ? "You do not have permission to view documents."
          : "Bạn chưa có quyền xem tài liệu.",
      listEmpty:
        language === "en" ? "No documents found." : "Không có tài liệu.",
      details: language === "en" ? "Details" : "Chi tiết",
      preview: language === "en" ? "Preview" : "Xem trước",
      close: language === "en" ? "Close" : "Đóng",
      download: language === "en" ? "Download" : "Tải xuống",
      versions: language === "en" ? "Versions" : "Xem phiên bản",
      setRag: language === "en" ? "Set as RAG active" : "Đặt làm bản RAG active",
      refreshSession:
        language === "en" ? "Refresh login session" : "Làm mới phiên đăng nhập",
      syncingHint:
        language === "en" ? "Syncing permissions & list…" : "Đang đồng bộ quyền & danh sách…",
      permissionHint403:
        language === "en"
          ? "If access was just granted, we refresh your session automatically — no need to sign out. You can also use the button below."
          : "Nếu vừa được cấp quyền, hệ thống tự làm mới phiên — không cần đăng xuất. Bạn vẫn có thể bấm nút bên dưới.",
      permissionPolling403:
        language === "en"
          ? "Checking for updated access…"
          : "Đang kiểm tra quyền mới…",
      permPreview:
        language === "en"
          ? "You do not have permission to preview this document inline."
          : "Bạn chưa có quyền xem trực tiếp nội dung tài liệu.",
      previewHint:
        language === "en"
          ? "Direct preview depends on file type and server extraction. PDF/DOCX may not show as text here — use Download."
          : "Xem trực tiếp phụ thuộc loại file và máy chủ. PDF/DOCX có thể không hiển thị dạng chữ — hãy Tải xuống.",
      loading: language === "en" ? "Loading…" : "Đang tải…",
      sortLabel: language === "en" ? "Sort" : "Sắp xếp",
      sortNewest: language === "en" ? "Newest first" : "Mới nhất",
      sortTitleAz: language === "en" ? "Title A–Z" : "Tiêu đề A–Z",
      sortTitleZa: language === "en" ? "Title Z–A" : "Tiêu đề Z–A",
      metaType: language === "en" ? "Format" : "Định dạng",
      metaSize: language === "en" ? "Size" : "Dung lượng",
      metaVisibility: language === "en" ? "Access" : "Phạm vi truy cập",
      metaEmbedding: language === "en" ? "Search index" : "Chỉ mục tìm kiếm",
      metaChunks: language === "en" ? "Text chunks" : "Đoạn văn (chunk)",
      aboutDoc: language === "en" ? "Summary" : "Tóm tắt",
      originalFile: language === "en" ? "Original file" : "Tệp gốc",
      previewBadgeText: language === "en" ? "Text" : "Văn bản",
      previewBadgePdf: language === "en" ? "PDF" : "PDF",
      previewBadgeOther: language === "en" ? "Preview" : "Xem trước",
      tagsLabel: language === "en" ? "Tags" : "Thẻ",
    }),
    [language]
  );

  useEffect(() => {
    if (!initialQuery) return;
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    getProfile()
      .then((p) => setProfileRoleName(p.roleName ?? null))
      .catch(() => setProfileRoleName(null));
  }, []);

  const loadList = useCallback((options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (silent) setListSyncing(true);
    else {
      setListLoading(true);
      setDocumentsErrorStatus(null);
    }
    listDocuments()
      .then((rows) => {
        setDocuments(rows);
        setDocumentsErrorStatus(null);
      })
      .catch((e: Error & { status?: number }) => {
        const status = typeof e.status === "number" ? e.status : null;
        if (silent) {
          // Đồng bộ nền: không xóa list đang có — tránh cảm giác “mất hết” khi token chưa kịp refresh / lỗi mạng tạm
          return;
        }
        setDocuments([]);
        setDocumentsErrorStatus(status);
      })
      .finally(() => {
        if (silent) setListSyncing(false);
        else setListLoading(false);
      });
  }, []);

  /** Làm mới JWT từ DB rồi tải lại list — dùng khi admin vừa đổi quyền (mọi máy qua polling + khi quay lại tab). */
  const syncPermissionsAndList = useCallback(async () => {
    await tryRefreshAuth();
    loadList({ silent: true });
  }, [loadList]);

  /** Làm mới JWT trước khi gọi API lần đầu — giảm 403 do token cũ sau khi admin cấp quyền. */
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await tryRefreshAuth();
      if (!cancelled) loadList();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadList]);

  const LIVE_POLL_MS = 10_000;
  const FAST_RETRY_403_MS = 4_500;
  const VISIBILITY_DEBOUNCE_MS = 450;

  useEffect(() => {
    const id = window.setInterval(() => {
      void syncPermissionsAndList();
    }, LIVE_POLL_MS);
    return () => window.clearInterval(id);
  }, [syncPermissionsAndList]);

  /** Khi đang hiển thị lỗi 403, thử đồng bộ thường xuyên hơn cho đến khi thành công. */
  useEffect(() => {
    if (documentsErrorStatus !== 403) return;
    const id = window.setInterval(() => {
      void syncPermissionsAndList();
    }, FAST_RETRY_403_MS);
    return () => window.clearInterval(id);
  }, [documentsErrorStatus, syncPermissionsAndList]);

  useEffect(() => {
    const schedule = () => {
      if (debounceSyncRef.current) window.clearTimeout(debounceSyncRef.current);
      debounceSyncRef.current = window.setTimeout(() => {
        debounceSyncRef.current = null;
        void syncPermissionsAndList();
      }, VISIBILITY_DEBOUNCE_MS);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
    };
    const onFocus = () => schedule();
    const onPageShow = () => schedule();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      if (debounceSyncRef.current) window.clearTimeout(debounceSyncRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [syncPermissionsAndList]);

  useEffect(() => {
    if (!selected) {
      setDetailDoc(null);
      return;
    }
    setDetailLoading(true);
    setDetailDoc(null);
    void getDocument(selected.id)
      .then(setDetailDoc)
      .catch(() => setDetailDoc(null))
      .finally(() => setDetailLoading(false));
  }, [selected?.id]);

  const displayDoc = detailDoc ?? selected;

  const filtered = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return documents;
    const terms = raw.split(/\s+/).filter((t) => t.length > 0);
    if (terms.length === 0) return documents;
    return documents.filter((d) => {
      const title = (d.documentTitle || d.originalFileName).toLowerCase();
      const tags = d.tags?.map((x) => x.name.toLowerCase()).join(" ") ?? "";
      const desc = (d.description ?? "").toLowerCase();
      const haystack = `${title} ${tags} ${desc}`;
      return terms.every((term) => haystack.includes(term));
    });
  }, [documents, query]);

  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    const titleOf = (d: DocumentResponse) => d.documentTitle || d.originalFileName;
    if (sortMode === "newest") {
      list.sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    } else if (sortMode === "title_az") {
      list.sort((a, b) => titleOf(a).localeCompare(titleOf(b), undefined, { sensitivity: "base" }));
    } else {
      list.sort((a, b) => titleOf(b).localeCompare(titleOf(a), undefined, { sensitivity: "base" }));
    }
    return list;
  }, [filtered, sortMode]);

  useEffect(() => {
    if (!query.trim()) return;
    if (sortedFiltered.length === 0) return;
    setSelected((prev) => prev ?? sortedFiltered[0]);
  }, [sortedFiltered, query]);

  const canSetRagActive = useMemo(() => {
    const r = (profileRoleName ?? "").toUpperCase();
    return r.includes("ADMIN") || r.includes("MANAGER");
  }, [profileRoleName]);

  useEffect(() => {
    if (!selected) return;

    if (pdfObjectUrlRef.current) {
      URL.revokeObjectURL(pdfObjectUrlRef.current);
      pdfObjectUrlRef.current = null;
    }

    setPreviewLoading(true);
    setPreviewError(null);
    setPreview(null);

    void getDocumentPreview(selected.id)
      .then((p) => {
        if (p.kind === "pdf") pdfObjectUrlRef.current = p.url;
        setPreview(p);
      })
      .catch((e) => {
        const err = e as Error & { status?: number };
        if (err.status === 403) setPreviewError(t.permPreview);
        else setPreviewError(t.previewHint);
      })
      .finally(() => setPreviewLoading(false));

    return () => {
      if (pdfObjectUrlRef.current) {
        URL.revokeObjectURL(pdfObjectUrlRef.current);
        pdfObjectUrlRef.current = null;
      }
    };
  }, [selected?.id, t.permPreview, t.previewHint]);

  useEffect(() => {
    setVersionsOpen(false);
    setVersions([]);
  }, [selected?.id]);

  const toggleVersions = async () => {
    if (!selected) return;
    if (versionsOpen) {
      setVersionsOpen(false);
      return;
    }
    setVersionsOpen(true);
    setVersionsLoading(true);
    try {
      const [hist, rag] = await Promise.all([
        getVersionHistory(selected.id),
        getActiveRagVersion(selected.id).catch(() => null),
      ]);
      setVersions(hist);
      setActiveRagId(rag?.active_version_id ?? null);
    } catch {
      setVersions([]);
    } finally {
      setVersionsLoading(false);
    }
  };

  const handleRefreshSessionAndReload = () => {
    void (async () => {
      const ok = await tryRefreshAuth();
      if (ok) {
        loadList({ silent: false });
        return;
      }
      const okStrict = await refreshAuth();
      if (okStrict) loadList({ silent: false });
      else {
        setDocuments([]);
        setDocumentsErrorStatus(403);
      }
    })();
  };

  const handleDownload = async (doc: DocumentResponse) => {
    setActionLoading(true);
    try {
      const blob = await downloadDocument(doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalFileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetRag = async (documentId: string, versionId: string) => {
    if (!canSetRagActive) return;
    setActionLoading(true);
    try {
      await setActiveRagVersion(documentId, versionId);
      setActiveRagId(versionId);
    } finally {
      setActionLoading(false);
    }
  };

  const listMessage = () => {
    if (documentsErrorStatus === 403) return t.noAccess;
    if (!listLoading && documents.length === 0 && !documentsErrorStatus) return t.listEmpty;
    return null;
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="shrink-0 border-b border-zinc-800/90 bg-zinc-950 px-4 py-5 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col">
          <div className="flex w-full items-start justify-between gap-3">
            <div
              className="flex min-w-0 flex-1 flex-row flex-nowrap items-baseline gap-x-2 overflow-x-auto text-left [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-x-3"
              title={
                language === "en"
                  ? "Filter by title or tag — select a card to preview."
                  : "Lọc theo tiêu đề hoặc thẻ — chọn thẻ để xem trước."
              }
            >
              <h1 className="shrink-0 text-lg font-semibold tracking-tight text-white sm:text-xl">
                {language === "en" ? "Document search" : "Tìm kiếm tài liệu"}
              </h1>
              <p className="shrink-0 whitespace-nowrap text-xs leading-normal text-zinc-500 sm:text-[13px]">
                {language === "en"
                  ? "Filter by title or tag — select a card to preview."
                  : "Lọc theo tiêu đề hoặc thẻ — chọn thẻ để xem trước."}
              </p>
            </div>
            {listSyncing ? (
              <span
                className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-emerald-400/95"
                title={documentsErrorStatus === 403 ? t.permissionPolling403 : t.syncingHint}
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden />
                <span className="hidden sm:inline">
                  {documentsErrorStatus === 403 ? t.permissionPolling403 : t.syncingHint}
                </span>
              </span>
            ) : null}
          </div>
          <form
            className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoComplete="off"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white shadow-inner placeholder-zinc-500 outline-none ring-emerald-500/0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25"
              />
            </div>
            <div className="flex w-full shrink-0 items-stretch gap-2 sm:w-[min(100%,220px)] sm:min-w-[200px]">
              <label className="sr-only" htmlFor="search-sort">
                {t.sortLabel}
              </label>
              <div className="relative flex w-full min-w-0 flex-1">
                <ListFilter
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500/90"
                  aria-hidden
                />
                <select
                  id="search-sort"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-emerald-500/35 bg-zinc-900 py-3 pl-10 pr-9 text-sm text-zinc-100 shadow-inner outline-none ring-emerald-500/0 transition hover:border-emerald-500/55 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25"
                >
                  <option value="newest">{t.sortNewest}</option>
                  <option value="title_az">{t.sortTitleAz}</option>
                  <option value="title_za">{t.sortTitleZa}</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="scrollbar-chat-hidden flex-1 overflow-y-auto scroll-smooth px-4 py-8 sm:px-6">
        {listLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : listMessage() ? (
          <div className="mx-auto flex max-w-lg justify-center px-2">
            <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-10 text-center shadow-lg shadow-black/20">
              <FileText className="mx-auto h-10 w-10 text-zinc-600" />
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{listMessage()}</p>
              {documentsErrorStatus === 403 ? (
                <>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-500">{t.permissionHint403}</p>
                  {listSyncing ? (
                    <p className="mt-3 inline-flex items-center justify-center gap-2 text-xs text-emerald-400/90">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      {t.permissionPolling403}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleRefreshSessionAndReload}
                    disabled={listLoading}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {listLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t.refreshSession
                    )}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-6xl px-2 text-center">
            <p className="text-sm text-zinc-400">{t.noDocs}</p>
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {sortedFiltered.map((doc) => {
              const title = doc.documentTitle || doc.originalFileName;
              const descLine = doc.description || doc.fileType.toUpperCase();
              const active = selected?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelected(doc)}
                  className={`flex min-h-[11.5rem] flex-col rounded-2xl border p-4 text-left shadow-md transition-all duration-200 sm:min-h-[12rem] ${
                    active
                      ? "border-emerald-500/70 bg-emerald-950/35 ring-1 ring-emerald-500/40"
                      : "border-white/[0.08] bg-gradient-to-b from-zinc-900/90 to-zinc-950 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-emerald-900/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-400 ring-1 ring-emerald-500/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                        <HighlightMatches text={title} query={query} />
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                        <HighlightMatches text={descLine} query={query} />
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/[0.06] pt-3 text-[11px] text-zinc-500">
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <Calendar className="h-3 w-3 shrink-0 text-zinc-500" />
                      {new Date(doc.uploadedAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                    </span>
                    {doc.tags?.length ? (
                      <span className="flex min-w-0 flex-1 flex-wrap justify-end gap-1">
                        {doc.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex max-w-[7rem] items-center gap-0.5 truncate rounded-full bg-zinc-800/90 px-2 py-0.5 text-zinc-300"
                          >
                            <Tag className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">
                              <HighlightMatches text={tag.name} query={query} />
                            </span>
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-[2px] sm:p-4"
          role="dialog"
          aria-modal
          onClick={() => setSelected(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-zinc-700/80 bg-zinc-900 shadow-2xl shadow-black/50 ring-1 ring-white/[0.06] lg:max-h-[88vh] lg:flex-row"
            onClick={(e) => e.stopPropagation()}
            aria-labelledby="document-detail-title"
          >
            <div className="flex min-h-0 w-full min-w-0 flex-col border-b border-zinc-800/90 lg:w-[min(100%,26rem)] lg:max-w-md lg:shrink-0 lg:border-b-0 lg:border-r lg:border-zinc-800/90">
              <div className="relative shrink-0 bg-gradient-to-br from-emerald-950/55 via-zinc-900/95 to-zinc-950 px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(16,185,129,0.12),transparent_55%)]" />
                <div className="relative flex gap-3.5 pr-4 sm:gap-4 sm:pr-6">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/[0.12] ring-1 ring-emerald-500/25 shadow-inner shadow-emerald-950/40 sm:size-14">
                    <FileText className="h-6 w-6 text-emerald-400 sm:h-7 sm:w-7" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/90">
                      {t.details}
                    </p>
                    {detailLoading ? (
                      <h2
                        id="document-detail-title"
                        className="mt-1 flex items-center gap-2 text-base font-semibold leading-snug text-white sm:text-lg"
                      >
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-emerald-400" />
                        <span className="truncate text-zinc-300">
                          {selected.documentTitle || selected.originalFileName}
                        </span>
                      </h2>
                    ) : (
                      <h2
                        id="document-detail-title"
                        className="mt-1 text-base font-semibold leading-snug text-white sm:text-lg"
                      >
                        {displayDoc?.documentTitle || displayDoc?.originalFileName}
                      </h2>
                    )}
                    {displayDoc?.documentTitle &&
                    displayDoc.originalFileName &&
                    displayDoc.documentTitle !== displayDoc.originalFileName ? (
                      <p className="mt-1.5 truncate text-xs text-zinc-500" title={displayDoc.originalFileName}>
                        <span className="text-zinc-600">{t.originalFile}</span>{" "}
                        {displayDoc.originalFileName}
                      </p>
                    ) : null}
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
                      <Calendar className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                      {new Date(displayDoc?.uploadedAt ?? selected.uploadedAt).toLocaleDateString(
                        language === "vi" ? "vi-VN" : "en-US",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="scrollbar-chat-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-3 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      <FileType className="h-3 w-3 text-emerald-500/80" aria-hidden />
                      {t.metaType}
                    </div>
                    <p className="mt-1.5 truncate text-sm font-medium text-zinc-100" title={displayDoc?.fileType}>
                      {(displayDoc?.fileType ?? "—").toUpperCase()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-3 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      <HardDrive className="h-3 w-3 text-emerald-500/80" aria-hidden />
                      {t.metaSize}
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-zinc-100">
                      {displayDoc != null ? formatFileSize(displayDoc.fileSize) : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-3 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      <Shield className="h-3 w-3 text-emerald-500/80" aria-hidden />
                      {t.metaVisibility}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-zinc-100">
                      {visibilityLabel(displayDoc?.visibility, language === "en")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-3 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      <Sparkles className="h-3 w-3 text-emerald-500/80" aria-hidden />
                      {t.metaEmbedding}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-zinc-100">
                      {embeddingLabel(displayDoc?.embeddingStatus, language === "en")}
                    </p>
                  </div>
                  {displayDoc?.chunkCount != null ? (
                    <div className="col-span-2 rounded-xl border border-white/[0.06] bg-zinc-950/50 p-3 shadow-inner">
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                        <Layers className="h-3 w-3 text-emerald-500/80" aria-hidden />
                        {t.metaChunks}
                      </div>
                      <p className="mt-1.5 text-sm font-medium tabular-nums text-zinc-100">
                        {displayDoc.chunkCount.toLocaleString(language === "vi" ? "vi-VN" : "en-US")}
                      </p>
                    </div>
                  ) : null}
                </div>

                {displayDoc?.tags?.length ? (
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {t.tagsLabel}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {displayDoc.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 text-xs font-medium text-emerald-100/95"
                        >
                          <Tag className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                          <span className="truncate">{tag.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {displayDoc?.description?.trim() ? (
                  <section className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-3.5 sm:p-4">
                    <h3 className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {t.aboutDoc}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">{displayDoc.description}</p>
                  </section>
                ) : null}

                <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => void handleDownload(displayDoc ?? selected)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 disabled:opacity-50 sm:min-w-[8rem]"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {t.download}
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleVersions()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-600/90 bg-zinc-800/40 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800 sm:min-w-[8rem]"
                  >
                    <History className="h-4 w-4 shrink-0 text-zinc-400" />
                    {t.versions}
                  </button>
                </div>

                {versionsOpen ? (
                  <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/60 p-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {t.versions}
                    </p>
                    <div className="scrollbar-chat-hidden max-h-44 overflow-y-auto">
                      {versionsLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                        </div>
                      ) : (
                        <ul className="space-y-1.5">
                          {versions.map((v) => {
                            const active = activeRagId === v.versionId;
                            return (
                              <li
                                key={v.versionId}
                                className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.04] bg-zinc-900/80 px-3 py-2"
                              >
                                <span className="text-xs font-medium text-zinc-200">
                                  v{v.versionNumber}
                                  {active ? (
                                    <CheckCircle2
                                      className="ml-1.5 inline h-3.5 w-3.5 align-text-bottom text-emerald-400"
                                      aria-label="RAG active"
                                    />
                                  ) : null}
                                </span>
                                <button
                                  type="button"
                                  disabled={actionLoading || active || !canSetRagActive}
                                  onClick={() => void handleSetRag(selected.id, v.versionId)}
                                  className="shrink-0 rounded-lg bg-emerald-600/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-600/30 disabled:pointer-events-none disabled:opacity-40"
                                >
                                  {t.setRag}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    {!canSetRagActive ? (
                      <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                        {language === "en"
                          ? "Only admins/managers can set the active RAG version."
                          : "Chỉ quản trị/quản lý mới đổi được bản RAG active."}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-zinc-950/35">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3 sm:px-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                    <Eye className="h-4 w-4" aria-hidden />
                  </span>
                  {t.preview}
                </h3>
                <span className="shrink-0 rounded-full bg-zinc-800/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {previewLoading
                    ? "…"
                    : previewError
                      ? t.previewBadgeOther
                      : preview?.kind === "text"
                        ? t.previewBadgeText
                        : preview?.kind === "pdf"
                          ? t.previewBadgePdf
                          : preview?.kind === "binary"
                            ? t.previewBadgeOther
                            : t.previewBadgeOther}
                </span>
              </div>
              <div className="scrollbar-chat-hidden flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-5">
                {previewLoading ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 py-16">
                    <Loader2 className="h-9 w-9 animate-spin text-emerald-500" />
                    <p className="text-xs text-zinc-500">{t.loading}</p>
                  </div>
                ) : previewError ? (
                  <div className="rounded-2xl border border-amber-500/25 bg-amber-950/25 px-4 py-5 text-center">
                    <p className="text-sm leading-relaxed text-amber-100/90">{previewError}</p>
                  </div>
                ) : preview?.kind === "text" ? (
                  <pre className="scrollbar-chat-hidden max-h-[min(58vh,32rem)] flex-1 overflow-auto whitespace-pre-wrap rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-300 shadow-inner sm:max-h-none sm:p-5">
                    {preview.text}
                  </pre>
                ) : preview?.kind === "pdf" ? (
                  <iframe
                    title="pdf-preview"
                    src={preview.url}
                    className="min-h-[min(52vh,28rem)] w-full flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-inner sm:min-h-[56vh]"
                  />
                ) : preview?.kind === "binary" ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-12 text-center">
                    <FileText className="h-10 w-10 text-zinc-600" />
                    <p className="max-w-sm text-sm text-zinc-400">
                      {language === "en"
                        ? `This file type (${preview.mime}) cannot be previewed here. Use Download to open it.`
                        : `Không xem trước được loại tệp (${preview.mime}). Hãy tải xuống để mở.`}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-14 text-center">
                    <Eye className="h-10 w-10 text-zinc-600" />
                    <p className="max-w-md text-sm leading-relaxed text-zinc-500">{t.previewHint}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
