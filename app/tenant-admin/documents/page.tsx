"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { FileText, FolderTree, Tag, Upload } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { usePathname } from "next/navigation";

function TabPanelSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="h-4 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-10 w-52 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

const DocumentsTab = dynamic(
  () => import("@/components/tenant-admin/DocumentsTab").then((m) => m.DocumentsTab),
  { loading: () => <TabPanelSkeleton /> }
);

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

export default function DocumentsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <TenantAdminLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {t.documentsKnowledgeBase}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            {t.documentsKBDescription}
          </p>
        </div>

        <DocumentsNavigation />

        <DocumentsTab mode="library" />
      </div>
    </TenantAdminLayout>
  );
}
