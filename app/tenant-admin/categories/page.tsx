"use client";

import { useState, useEffect } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import {
  FileText,
  Upload,
  FolderTree,
  Tag,
  Plus,
  ChevronRight,
  ChevronDown,
  Edit2,
  Trash2,
  FolderOpen,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  parentId: string | null;
  children?: Category[];
}

// Mock data - replace with real API
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Human Resources",
    status: "ACTIVE",
    parentId: null,
    children: [
      { id: "1-1", name: "Policies", status: "ACTIVE", parentId: "1" },
      { id: "1-2", name: "Benefits", status: "ACTIVE", parentId: "1" },
      { id: "1-3", name: "Onboarding", status: "INACTIVE", parentId: "1" },
    ],
  },
  {
    id: "2",
    name: "IT & Security",
    status: "ACTIVE",
    parentId: null,
    children: [
      { id: "2-1", name: "Network", status: "ACTIVE", parentId: "2" },
      { id: "2-2", name: "Software", status: "ACTIVE", parentId: "2" },
    ],
  },
  {
    id: "3",
    name: "Finance",
    status: "ACTIVE",
    parentId: null,
  },
];

function CategoryTreeItem({ category, level = 0 }: { category: Category; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="h-5 w-5" />
        )}

        {/* Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
          {isExpanded && hasChildren ? (
            <FolderOpen className="h-4 w-4" />
          ) : (
            <Folder className="h-4 w-4" />
          )}
        </div>

        {/* Name */}
        <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-white">
          {category.name}
        </span>

        {/* Status Badge */}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            category.status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {category.status === "ACTIVE" ? "Active" : "Inactive"}
        </span>

        {/* Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1"
            >
              <button className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-100 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {category.children!.map((child) => (
              <CategoryTreeItem key={child.id} category={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
    { href: "/tenant-admin/tags", label: t.tags, icon: Tag },
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

export default function CategoriesPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <TenantAdminLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t.categories}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {isEn
              ? "Organize your documents into hierarchical categories"
              : "Tổ chức tài liệu của bạn thành các danh mục phân cấp"}
          </p>
        </div>

        {/* Navigation */}
        <DocumentsNavigation />

        {/* Toolbar */}
        <div className="flex items-center justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            {isEn ? "Create Category" : "Tạo danh mục"}
          </button>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-emerald-600 dark:border-zinc-800 dark:border-t-emerald-400" />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <FolderTree className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {isEn ? "No categories yet" : "Chưa có danh mục"}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {isEn
                  ? "Create your first category to organize documents"
                  : "Tạo danh mục đầu tiên để tổ chức tài liệu"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map((category) => (
                <CategoryTreeItem key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </div>
    </TenantAdminLayout>
  );
}
