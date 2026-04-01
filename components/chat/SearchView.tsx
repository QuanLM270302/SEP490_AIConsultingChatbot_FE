"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, FileText, Calendar, Tag, ExternalLink } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { listDocuments } from "@/lib/api/documents";
import type { DocumentResponse } from "@/types/knowledge";
import { getProfile } from "@/lib/api/profile";

export function SearchView() {
  const { language } = useLanguageStore();
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [documentsErrorStatus, setDocumentsErrorStatus] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<DocumentResponse | null>(null);
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
        {/* Results List */}
        <div className={`flex-1 overflow-y-auto p-6 ${selectedResult ? "lg:w-1/2" : ""}`}>
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

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredResults.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedResult(doc)}
                      className="group rounded-xl border border-white/10 bg-white/5 p-5 text-left transition-all hover:border-emerald-500/50 hover:bg-white/10"
                    >
                      <h3 className="line-clamp-2 text-base font-semibold text-white group-hover:text-emerald-400">
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

                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                        {highlightText(
                          doc.description ||
                            (language === "en"
                              ? "No description available."
                              : "Chưa có mô tả cho tài liệu này."),
                          query
                        )}
                      </p>

                      {doc.tags?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-xs text-zinc-400"
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

        {/* Document Preview Panel */}
        {selectedResult && (
          <div className="hidden w-1/2 border-l border-white/10 bg-[#0b0b0c] p-6 lg:block">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {language === "en" ? "Document Preview" : "Xem trước tài liệu"}
              </h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              >
                <ExternalLink className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-bold text-white">
                {selectedResult.documentTitle || selectedResult.originalFileName}
              </h3>
              <div className="mt-4 space-y-4 text-sm text-zinc-300">
                <p>
                  {selectedResult.description ||
                    (language === "en"
                      ? "No description available."
                      : "Chưa có mô tả cho tài liệu này.")}
                </p>
                <p className="text-zinc-400">
                  {language === "en"
                    ? "Full document preview would be displayed here..."
                    : "Nội dung đầy đủ của tài liệu sẽ hiển thị ở đây..."}
                </p>
                <div className="rounded-lg bg-white/5 p-3 text-xs text-zinc-400">
                  <p>
                    {language === "en" ? "Applied access context:" : "Ngữ cảnh quyền đang áp dụng:"}
                  </p>
                  <p className="mt-1">
                    {language === "en"
                      ? `Role: ${profileRoleName ?? "N/A"} | Department: ${profileDepartmentName ?? "N/A"}`
                      : `Vai trò: ${profileRoleName ?? "N/A"} | Phòng ban: ${profileDepartmentName ?? "N/A"}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
