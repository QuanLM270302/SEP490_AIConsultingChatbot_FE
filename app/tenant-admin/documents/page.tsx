"use client";

import { useState } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { FileText, FolderTree, Tag } from "lucide-react";
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
    <TenantAdminLayout>
      <div className="space-y-8">
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
    </TenantAdminLayout>
  );
}
