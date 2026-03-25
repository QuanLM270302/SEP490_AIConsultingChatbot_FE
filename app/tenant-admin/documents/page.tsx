"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import Link from "next/link";
import { ArrowLeft, FileText, FolderTree, Tag } from "lucide-react";
import { DocumentsTab } from "@/components/tenant-admin/DocumentsTab";
import { CategoriesTab } from "@/components/tenant-admin/CategoriesTab";
import { TagsTab } from "@/components/tenant-admin/TagsTab";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

type TabId = "documents" | "categories" | "tags";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("documents");
  const { language } = useLanguageStore();
  const t = translations[language];

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "documents", label: t.documents, icon: FileText },
    { id: "categories", label: t.categories, icon: FolderTree },
    { id: "tags", label: t.tags, icon: Tag },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-zinc-100 via-white to-zinc-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <AppHeader />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <Link
            href="/tenant-admin"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToDashboard}
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {t.documentsKnowledgeBase}
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {t.documentsKBDescription}
            </p>
          </div>

          <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border-green-500 text-green-600 dark:text-green-400"
                      : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "tags" && <TagsTab />}
        </div>
      </main>
    </div>
  );
}
