"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, FileText, Calendar, Tag, ExternalLink, X } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import {
  downloadDocument,
  getActiveRagVersion,
  getDocumentContent,
  getVersionHistory,
  listDocuments,
  setActiveRagVersion,
} from "@/lib/api/documents";
import type { DocumentResponse, DocumentVersionResponse } from "@/types/knowledge";
import { getProfile } from "@/lib/api/profile";

interface SearchViewProps {
  initialQuery?: string;
}

export function SearchView({ initialQuery }: SearchViewProps) {
  const { language } = useLanguageStore();
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [documentsErrorStatus, setDocumentsErrorStatus] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<DocumentResponse | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [versions, setVersions] = useState<DocumentVersionResponse[]>([]);
  const [activeRagVersionId, setActiveRagVersionId] = useState<string | null>(null);
  const [versionLoading, setVersionLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [profileRoleName, setProfileRoleName] = useState<string | null>(null);
  const [profileDepartmentName, setProfileDepartmentName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsSearching(true);

    Promise.all([
      listDocuments(),
      getProfile().catch(() => null),
    ])
      .then(([docs, profile]) => {
        if (!mounted) return;
        setDocuments(docs);
        setDocumentsErrorStatus(null);
        setProfileRoleName(profile?.roleName ?? null);
        setProfileDepartmentName(profile?.departmentName ?? null);
      })
      .catch((error) => {
        if (!mounted) return;
        const status =
          typeof error === "object" && error && "status" in error
            ? Number((error as { status?: number }).status)
            : null;
        setDocuments([]);
        setDocumentsErrorStatus(Number.isFinite(status) ? status : null);
      })
      .finally(() => {
        if (!mounted) return;
        setIsSearching(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!initialQuery) return;
    setQuery(initialQuery);
  }, [initialQuery]);

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents
      .filter((doc) => {
        if (!q) return true;
        const title = (doc.documentTitle || doc.originalFileName || "").toLowerCase();
        const desc = (doc.description || "").toLowerCase();
        const tagText = (doc.tags ?? [])
          .map((t) => `${t.name} ${t.code}`.toLowerCase())
          .join(" ");
        return title.includes(q) || desc.includes(q) || tagText.includes(q);
      });
  }, [documents, query]);

  useEffect(() => {
    if (!query.trim()) return;
    if (filteredResults.length === 0) return;
      setSelectedResult((prev) => prev ?? filteredResults[0]);
  }, [filteredResults, query]);

  useEffect(() => {
    if (!selectedResult) return;
    setPreviewLoading(true);
    setPreviewError(null);
    getDocumentContent(selectedResult.id)
      .then((content) => setPreviewContent(content || ""))
      .catch((error) => {
        const reason = error instanceof Error ? error.message : "";
        setPreviewContent("");
        setPreviewError(
          language === "en"
            ? `Cannot preview content directly. ${reason || "This file type may require download or backend extraction support."}`
            : `Không thể xem trực tiếp nội dung. ${reason || "Tệp này có thể cần tải xuống hoặc backend chưa hỗ trợ trích xuất nội dung."}`
        );
      })
      .finally(() => setPreviewLoading(false));
  }, [selectedResult, language]);

  useEffect(() => {
    if (!selectedResult) return;
    setVersionLoading(true);
    Promise.all([
      getVersionHistory(selectedResult.id).catch(() => []),
      getActiveRagVersion(selectedResult.id).catch(() => null),
    ])
      .then(([history, active]) => {
        setVersions(history);
        setActiveRagVersionId(active?.versionId ?? null);
      })
      .finally(() => setVersionLoading(false));
  }, [selectedResult]);

  const handleDownload = async () => {
    if (!selectedResult) return;
    setActionLoading(true);
    try {
      const blob = await downloadDocument(selectedResult.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedResult.originalFileName || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : language === "en" ? "Download failed" : "Tải xuống thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetActiveRag = async (versionId: string) => {
    if (!selectedResult) return;
    setActionLoading(true);
    try {
      await setActiveRagVersion(selectedResult.id, versionId);
      setActiveRagVersionId(versionId);
    } catch (e) {
      alert(e instanceof Error ? e.message : language === "en" ? "Update failed" : "Cập nhật thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const highlightText = (text: string, q: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="rounded bg-emerald-500/20 px-0.5 text-emerald-400">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      {/* Search Header */}
      <div className="border-b border-white/10 bg-[#0b0b0c] px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-2xl font-bold text-white">
            {language === "en" ? "Search Knowledge Base" : "Tìm kiếm Kho tri thức"}
          </h1>
          <p className="text-sm text-zinc-400">
            {language === "en"
              ? "Find documents, policies, and information across your organization"
              : "Tìm tài liệu, chính sách và thông tin trong tổ chức"}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mt-6"
          >
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-emerald-500/50 focus-within:bg-white/10">
              <Search className="h-5 w-5 text-zinc-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  language === "en"
                    ? "Search company knowledge..."
                    : "Tìm kiếm tri thức công ty..."
                }
                className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
              />
              <span className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300">
                {language === "en" ? "Live filter" : "Lọc trực tiếp"}
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            {!isSearching && filteredResults.length === 0 && (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <Search className="mx-auto h-12 w-12 text-zinc-600" />
                  <p className="mt-4 text-sm text-zinc-500">
                    {documentsErrorStatus === 403
                      ? language === "en"
                        ? "You do not have permission to view documents"
                        : "Bạn chưa có quyền xem tài liệu"
                      : language === "en"
                        ? "No documents found"
                        : "Không có tài liệu"}
                  </p>
                </div>
              </div>
            )}

            {isSearching && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="h-4 w-3/4 rounded bg-white/10"></div>
                    <div className="mt-3 h-3 w-full rounded bg-white/10"></div>
                    <div className="mt-2 h-3 w-2/3 rounded bg-white/10"></div>
                  </div>
                ))}
              </div>
            )}

            {filteredResults.length > 0 && !isSearching && (
              <div className="space-y-4">
                <div className="mb-4 text-sm text-zinc-400">
                  {language === "en"
                    ? `Found ${filteredResults.length} results`
                    : `Tìm thấy ${filteredResults.length} kết quả`}
                </div>

                <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredResults.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedResult(doc)}
                      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.04] p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
                    >
                      <h3 className="min-h-[3rem] line-clamp-2 text-base font-semibold text-white group-hover:text-emerald-400">
                        {highlightText(doc.documentTitle || doc.originalFileName, query)}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {doc.fileType || "DOC"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(doc.uploadedAt).toLocaleDateString(
                            language === "vi" ? "vi-VN" : "en-US"
                          )}
                        </span>
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400">
                          {doc.visibility}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-4 min-h-[5rem] text-sm leading-relaxed text-zinc-400">
                        {highlightText(
                          doc.description ||
                            (language === "en"
                              ? "No description available."
                              : "Chưa có mô tả cho tài liệu này."),
                          query
                        )}
                      </p>

                      {doc.tags?.length ? (
                        <div className="mt-auto pt-3 flex flex-wrap gap-2">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400"
                            >
                              <Tag className="h-3 w-3" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedResult(null)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">
                {language === "en" ? "Document details & preview" : "Chi tiết và xem tài liệu"}
              </h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid max-h-[calc(90vh-68px)] gap-0 overflow-hidden lg:grid-cols-2">
              <div className="overflow-y-auto border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                <h3 className="text-xl font-bold text-white">
                  {selectedResult.documentTitle || selectedResult.originalFileName}
                </h3>
                <p className="mt-3 text-sm text-zinc-300">
                  {selectedResult.description ||
                    (language === "en"
                      ? "No description available."
                      : "Chưa có mô tả cho tài liệu này.")}
                </p>
                <div className="mt-4 space-y-2 text-xs text-zinc-400">
                  <p>
                    {language === "en"
                      ? `Role: ${profileRoleName ?? "N/A"} | Department: ${profileDepartmentName ?? "N/A"}`
                      : `Vai trò: ${profileRoleName ?? "N/A"} | Phòng ban: ${profileDepartmentName ?? "N/A"}`}
                  </p>
                  <p>
                    {language === "en" ? "Uploaded:" : "Ngày tải lên:"}{" "}
                    {new Date(selectedResult.uploadedAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={actionLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {language === "en" ? "Download" : "Tải xuống"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVersions((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/5"
                  >
                    {showVersions
                      ? language === "en"
                        ? "Hide versions"
                        : "Ẩn phiên bản"
                      : language === "en"
                        ? "View versions"
                        : "Xem phiên bản"}
                  </button>
                </div>

                {showVersions && (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="mb-2 text-xs font-semibold text-zinc-300">
                    {language === "en" ? "Version list / RAG active" : "Danh sách phiên bản / RAG active"}
                  </p>
                  {versionLoading ? (
                    <p className="text-xs text-zinc-400">{language === "en" ? "Loading versions..." : "Đang tải phiên bản..."}</p>
                  ) : versions.length === 0 ? (
                    <p className="text-xs text-zinc-400">{language === "en" ? "No versions found." : "Không có phiên bản."}</p>
                  ) : (
                    <div className="space-y-2">
                      {versions.slice(0, 5).map((v) => {
                        const active = activeRagVersionId === v.versionId;
                        return (
                          <div key={v.versionId} className="flex items-center justify-between rounded-md border border-white/10 px-2 py-1.5">
                            <span className="text-xs text-zinc-200">v{v.versionNumber}</span>
                            <button
                              type="button"
                              onClick={() => handleSetActiveRag(v.versionId)}
                              disabled={actionLoading || active}
                              className={`rounded px-2 py-1 text-[11px] ${
                                active
                                  ? "bg-emerald-500/25 text-emerald-300"
                                  : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                              }`}
                            >
                              {active
                                ? language === "en"
                                  ? "RAG active"
                                  : "Đang active"
                                : language === "en"
                                  ? "Set RAG active"
                                  : "Đặt RAG active"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                )}
              </div>

              <div className="overflow-y-auto p-6">
                <h4 className="mb-3 text-sm font-semibold text-zinc-200">
                  {language === "en" ? "Direct content preview" : "Xem nội dung trực tiếp"}
                </h4>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  {previewLoading ? (
                    <p className="text-sm text-zinc-400">{language === "en" ? "Loading..." : "Đang tải..."}</p>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                      {previewContent ||
                        previewError ||
                        (language === "en"
                          ? "No readable content."
                          : "Không có nội dung đọc trực tiếp.")}
                    </pre>
                  )}
                </div>
                {previewError ? (
                  <p className="mt-3 text-xs text-amber-300">
                    {language === "en"
                      ? "Reason: direct preview depends on `/content` API and backend extraction. Binary files (PDF/DOCX/scans) may fail if extraction is unavailable."
                      : "Lý do: xem trực tiếp phụ thuộc API `/content` và khả năng trích xuất nội dung từ backend. Các file nhị phân (PDF/DOCX/scan) có thể không xem được nếu backend chưa hỗ trợ trích xuất."}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
