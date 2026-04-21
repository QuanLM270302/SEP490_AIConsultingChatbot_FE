"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Upload, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { DocumentsTab } from "@/components/tenant-admin/DocumentsTab";
import { DocumentUploadCard } from "@/components/tenant-admin/DocumentUploadCard";
import { listCategoriesFlat } from "@/lib/api/categories";
import { listTagsActive } from "@/lib/api/tags";
import { getTenantActiveDepartments, getTenantRoles } from "@/lib/api/tenant-admin";
import { uploadDocument, type UploadDocumentParams } from "@/lib/api/documents";
import { getStoredUser, tryRefreshAuth } from "@/lib/auth-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import type { DocumentCategoryResponse, DocumentTagResponse } from "@/types/knowledge";
import type { DepartmentResponse, RoleResponse } from "@/lib/api/tenant-admin";

const RECENT_UPLOAD_IDS_KEY = "document-dashboard:recent-upload-ids";

function writeRecentUploadId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(RECENT_UPLOAD_IDS_KEY);
    const ids = raw ? (JSON.parse(raw) as unknown) : [];
    const next = new Set(
      Array.isArray(ids) ? ids.filter((value): value is string => typeof value === "string") : []
    );
    next.add(id);
    window.localStorage.setItem(RECENT_UPLOAD_IDS_KEY, JSON.stringify(Array.from(next)));
  } catch {
    // Ignore storage failures (private mode, quota, etc.) — local cache is best-effort.
  }
}

const READ_DOCUMENT_AUTHORITIES = ["DOCUMENT_READ", "DOCUMENT_ALL", "ALL"] as const;
const MANAGE_DOCUMENT_AUTHORITIES = ["DOCUMENT_WRITE", "DOCUMENT_ALL", "ALL"] as const;

function hasAnyAuthority(authorities: string[], required: readonly string[]): boolean {
  return authorities.some((authority) => required.includes(authority as (typeof required)[number]));
}

/**
 * Sub-navigation between Documents library and Upload card.
 * The top-level tab bar lives in the shared workspace layout; this secondary nav is kept
 * so "Upload" stays discoverable when the top tab bar overflow-scrolls on narrow screens.
 */
function DocumentsSubNav({
  activeTab,
  canManageDocuments,
}: {
  activeTab: "documents" | "upload";
  canManageDocuments: boolean;
}) {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-white/90 p-2 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <Link
        href="/document-dashboard"
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeTab === "documents"
            ? "scale-[1.01] bg-emerald-600 text-white shadow-sm"
            : "text-zinc-600 hover:-translate-y-0.5 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
        }`}
      >
        <BookOpen className="h-4 w-4" />
        {t.documents}
      </Link>

      {canManageDocuments && (
        <Link
          href="/document-dashboard?mode=upload"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeTab === "upload"
              ? "scale-[1.01] bg-emerald-600 text-white shadow-sm"
              : "text-zinc-600 hover:-translate-y-0.5 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          }`}
        >
          <Upload className="h-4 w-4" />
          {language === "en" ? "Upload" : "Đăng tải"}
        </Link>
      )}
    </div>
  );
}

function UploadSkeleton() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-40 animate-pulse rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
        <div className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}

/**
 * DocumentDashboardPage is rendered inside the shared workspace shell.
 * It must NOT create its own chrome (sidebar/tab bar) — the layout owns that.
 */
export default function DocumentDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguageStore();
  const [hydrated, setHydrated] = useState(false);
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [categories, setCategories] = useState<DocumentCategoryResponse[]>([]);
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await tryRefreshAuth();
      if (cancelled) return;
      const user = getStoredUser();
      setAuthorities(user?.roles ?? []);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [cats, activeTags, depts, tenantRoles] = await Promise.all([
          listCategoriesFlat(),
          listTagsActive(),
          getTenantActiveDepartments().catch(() => []),
          getTenantRoles().catch(() => []),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setTags(activeTags);
        setDepartments(depts);
        setRoles(tenantRoles);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canReadDocuments = useMemo(
    () => hasAnyAuthority(authorities, READ_DOCUMENT_AUTHORITIES),
    [authorities]
  );
  const canManageDocuments = useMemo(
    () => hasAnyAuthority(authorities, MANAGE_DOCUMENT_AUTHORITIES),
    [authorities]
  );
  const activeTab: "documents" | "upload" =
    searchParams.get("mode") === "upload" ? "upload" : "documents";

  useEffect(() => {
    if (!hydrated) return;
    if (!canReadDocuments) router.replace("/chatbot-new");
  }, [canReadDocuments, hydrated, router]);

  useEffect(() => {
    if (!hydrated) return;
    if (!canManageDocuments && activeTab === "upload") router.replace("/document-dashboard");
  }, [activeTab, canManageDocuments, hydrated, router]);

  const handleUpload = async (data: {
    file: File;
    categoryId?: string;
    tagIds: string[];
    description?: string;
    visibility: "COMPANY_WIDE" | "SPECIFIC_DEPARTMENTS" | "SPECIFIC_ROLES" | "SPECIFIC_DEPARTMENTS_AND_ROLES";
    departmentIds: number[];
    roleIds: number[];
  }) => {
    const params: UploadDocumentParams = {
      file: data.file,
      categoryId: data.categoryId || null,
      tagIds: data.tagIds.length ? data.tagIds : null,
      description: data.description || null,
      visibility: data.visibility,
      accessibleDepartments: data.departmentIds.length ? data.departmentIds : null,
      accessibleRoles: data.roleIds.length ? data.roleIds : null,
    };
    const uploaded = await uploadDocument(params);
    writeRecentUploadId(uploaded.id);
    router.replace("/document-dashboard");
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500/40 border-t-emerald-500" />
      </div>
    );
  }

  if (!canReadDocuments) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {language === "en"
              ? "You do not have permission to access the Document Dashboard. Redirecting..."
              : "Bạn không có quyền truy cập Document Dashboard. Đang chuyển hướng..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 lg:space-y-8 lg:p-6">
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl shadow-emerald-500/10 dark:border-zinc-800">
          <div className="grid gap-6 p-6 text-white md:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                {language === "en" ? "Document hub" : "Trung tâm tài liệu"}
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                {language === "en" ? "Documents" : "Tài liệu"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
                {language === "en"
                  ? "Browse, search, and manage company knowledge with a clean workspace that matches the app design system."
                  : "Duyệt, tìm kiếm và quản lý tri thức công ty trong không gian làm việc đồng bộ với giao diện tổng thể."}
              </p>
            </div>
            <div className="flex flex-wrap items-start justify-end gap-3 lg:justify-end">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  {language === "en" ? "Permission-aware" : "Theo quyền truy cập"}
                </div>
                <p className="mt-1 text-xs text-white/80">
                  {language === "en"
                    ? "Read access is always available; upload appears only for writers."
                    : "Chỉ hiện upload cho role có quyền ghi."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <DocumentsSubNav activeTab={activeTab} canManageDocuments={canManageDocuments} />

        <div key={activeTab} className="animate-view-enter">
          {activeTab === "upload" ? (
            canManageDocuments ? (
              loadingMeta ? (
                <UploadSkeleton />
              ) : (
                <DocumentUploadCard
                  categories={categories}
                  tags={tags}
                  departments={departments}
                  roles={roles}
                  uploading={false}
                  onUpload={handleUpload}
                />
              )
            ) : null
          ) : (
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6 lg:p-8">
              <DocumentsTab mode="library" hideEditActions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
