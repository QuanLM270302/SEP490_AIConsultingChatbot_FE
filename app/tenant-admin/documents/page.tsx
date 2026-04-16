"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
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

const DocumentUploadCard = dynamic(
  () => import("@/components/tenant-admin/DocumentUploadSection").then((m) => m.DocumentUploadSection),
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
  const [activeTab, setActiveTab] = useState<TabId>("documents");
  const [mountedTabs, setMountedTabs] = useState<Record<TabId, boolean>>({
    upload: false,
    documents: true,
    categories: false,
    tags: false,
  });
  const [isTabPending, startTabTransition] = useTransition();
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "documents", label: t.documents, icon: FileText },
    { id: "upload", label: language === "en" ? "Upload documents" : "Đăng tải tài liệu", icon: Upload },
    { id: "categories", label: t.categories, icon: FolderTree },
    { id: "tags", label: t.tags, icon: Tag },
  ];

  useEffect(() => {
    const warmupId = window.setTimeout(() => {
      setMountedTabs((prev) =>
        prev.upload ? prev : { ...prev, upload: true }
      );
    }, 420);
    return () => window.clearTimeout(warmupId);
  }, []);

  const renderTabContent = (tab: TabId) => {
    if (tab === "upload") return <DocumentUploadCard />;
    if (tab === "documents") return <DocumentsTab mode="library" />;
    if (tab === "categories") return <CategoriesTab />;
    return <TagsTab />;
  };

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
                  setMountedTabs((prev) =>
                    prev[tab.id] ? prev : { ...prev, [tab.id]: true }
                  );
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

          <div className="relative">
            {tabs.map((tab) => {
              if (!mountedTabs[tab.id]) return null;
              const isActive = activeTab === tab.id;
              return (
                <motion.div
                  key={tab.id}
                  initial={false}
                  animate={
                    isActive
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 8, scale: 0.995 }
                  }
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className={
                    isActive
                      ? "relative"
                      : "pointer-events-none absolute inset-0 overflow-hidden"
                  }
                  style={{ visibility: isActive ? "visible" : "hidden" }}
                >
                  {renderTabContent(tab.id)}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </TenantAdminLayout>
  );
}
