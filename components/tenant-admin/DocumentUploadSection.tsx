"use client";

import { useState, useEffect } from "react";
import { DocumentUploadCard } from "./DocumentUploadCard";
import { listCategoriesFlat } from "@/lib/api/categories";
import { listTagsActive } from "@/lib/api/tags";
import { getTenantActiveDepartments, getTenantRoles } from "@/lib/api/tenant-admin";
import { uploadDocument, type UploadDocumentParams } from "@/lib/api/documents";
import type { DocumentCategoryResponse, DocumentTagResponse } from "@/types/knowledge";
import type { DepartmentResponse, RoleResponse } from "@/lib/api/tenant-admin";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

export function DocumentUploadSection() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const [categories, setCategories] = useState<DocumentCategoryResponse[]>([]);
  const [tags, setTags] = useState<DocumentTagResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, activeTags, depts, tenantRoles] = await Promise.all([
          listCategoriesFlat(),
          listTagsActive(),
          getTenantActiveDepartments().catch(() => []),
          getTenantRoles().catch(() => []),
        ]);
        setCategories(cats);
        setTags(activeTags);
        setDepartments(depts);
        setRoles(tenantRoles);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const handleUpload = async (data: {
    file: File;
    categoryId?: string;
    tagIds: string[];
    description?: string;
    visibility: "COMPANY_WIDE" | "SPECIFIC_DEPARTMENTS" | "SPECIFIC_ROLES" | "SPECIFIC_DEPARTMENTS_AND_ROLES";
    departmentIds: number[];
    roleIds: number[];
  }) => {
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const params: UploadDocumentParams = {
        file: data.file,
        categoryId: data.categoryId || null,
        tagIds: data.tagIds.length ? data.tagIds : null,
        description: data.description || null,
        visibility: data.visibility,
        accessibleDepartments: data.departmentIds.length ? data.departmentIds : null,
        accessibleRoles: data.roleIds.length ? data.roleIds : null,
      };

      await uploadDocument(params);
      setSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {isEn ? "Loading..." : "Đang tải..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          {isEn
            ? "✓ Document uploaded successfully!"
            : "✓ Tải lên tài liệu thành công!"}
        </div>
      )}

      {/* Upload Card */}
      <DocumentUploadCard
        categories={categories}
        tags={tags}
        departments={departments}
        roles={roles}
        uploading={uploading}
        onUpload={handleUpload}
      />
    </div>
  );
}
