"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useTransition } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { FileText, FolderTree, Tag, Upload } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

type TabId = "upload" | "documents" | "categories" | "tags";

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

const CategoriesTab = dynamic(
  () => import("@/components/tenant-admin/CategoriesTab").then((m) => m.CategoriesTab),
  { loading: () => <TabPanelSkeleton /> }
);

const TagsTab = dynamic(
  () => import("@/components/tenant-admin/TagsTab").then((m) => m.TagsTab),
  { loading: () => <TabPanelSkeleton /> }
);

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("upload");
  const [isTabPending, startTabTransition] = useTransition();
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "upload", label: language === "en" ? "Upload documents" : "Đăng tải tài liệu", icon: Upload },
    { id: "documents", label: t.documents, icon: FileText },
    { id: "categories", label: t.categories, icon: FolderTree },
    { id: "tags", label: t.tags, icon: Tag },
  ];

  const activeTabContent = useMemo(() => {
    if (activeTab === "upload") return <DocumentsTab mode="upload" />;
    if (activeTab === "documents") return <DocumentsTab mode="library" />;
    if (activeTab === "categories") return <CategoriesTab />;
    return <TagsTab />;
  }, [activeTab]);

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
                onClick={() => {
                  startTabTransition(() => setActiveTab(tab.id));
                }}
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

        <div className="relative">
          {isTabPending ? (
            <div className="pointer-events-none absolute right-0 top-[-14px] z-10 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              {isEn ? "Switching..." : "Đang chuyển tab..."}
            </div>
          ) : null}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTabContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </TenantAdminLayout>
  );
}
