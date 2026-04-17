"use client";

import { useState, useEffect } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import {
  FileText,
  Upload,
  FolderTree,
  Tag as TagIcon,
  Plus,
  Edit2,
  Trash2,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Tag {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  documentCount?: number;
}

// Mock data - replace with real API
const mockTags: Tag[] = [
  { id: "1", name: "Urgent", status: "ACTIVE", documentCount: 12 },
  { id: "2", name: "Policy", status: "ACTIVE", documentCount: 8 },
  { id: "3", name: "Training", status: "ACTIVE", documentCount: 15 },
  { id: "4", name: "Confidential", status: "ACTIVE", documentCount: 5 },
  { id: "5", name: "Public", status: "ACTIVE", documentCount: 23 },
  { id: "6", name: "Draft", status: "INACTIVE", documentCount: 3 },
  { id: "7", name: "Archived", status: "INACTIVE", documentCount: 7 },
];

function TagCard({ tag }: { tag: Tag }) {
  const [showActions, setShowActions] = useState(false);
  const { language } = useLanguageStore();
  const isEn = language === "en";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Icon */}
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-sm">
        <Hash className="h-5 w-5" />
      </div>

      {/* Name */}
      <h3 className="mb-1 text-base font-semibold text-zinc-900 dark:text-white">
        {tag.name}
      </h3>

      {/* ID */}
      <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        ID: {tag.id}
      </p>

      {/* Stats */}
      {tag.documentCount !== undefined && (
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          {tag.documentCount} {isEn ? "documents" : "tài liệu"}
        </p>
      )}

      {/* Status Badge */}
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          tag.status === "ACTIVE"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        }`}
      >
        {tag.status === "ACTIVE" ? (isEn ? "Active" : "Hoạt động") : (isEn ? "Inactive" : "Không hoạt động")}
      </span>

      {/* Actions */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute right-3 top-3 flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
              <Edit2 className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 transition hover:bg-red-100 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DocumentsNavigation() {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const t = translations[language];

  const navItems = [
    { href: "/tenant-admin/documents", label: t.documents, icon: FileText },
    { href: "/tenant-admin/documents-upload", label: language === "en" ? "Upload" : "Đăng tải", icon: Upload },
    { href: "/tenant-admin/categories", label: t.categories, icon: FolderTree },
    { href: "/tenant-admin/tags", label: t.tags, icon: TagIcon },
  ];

  return (
    <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-white"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function TagsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTags(mockTags);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <TenantAdminLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t.tags}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {isEn
              ? "Label and categorize documents with tags for easy filtering"
              : "Gắn nhãn và phân loại tài liệu bằng tags để lọc dễ dàng"}
          </p>
        </div>

        {/* Navigation */}
        <DocumentsNavigation />

        {/* Toolbar */}
        <div className="flex items-center justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            {isEn ? "Create Tag" : "Tạo tag"}
          </button>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-600 dark:border-zinc-800 dark:border-t-emerald-400" />
            </div>
          ) : tags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <TagIcon className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {isEn ? "No tags yet" : "Chưa có tags"}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {isEn
                  ? "Create your first tag to label documents"
                  : "Tạo tag đầu tiên để gắn nhãn tài liệu"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tags.map((tag) => (
                <TagCard key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </TenantAdminLayout>
  );
}
