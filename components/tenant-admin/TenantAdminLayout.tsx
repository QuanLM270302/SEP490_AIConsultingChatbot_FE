"use client";

import { TenantAdminSidebar } from "./TenantAdminSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AcademicCapIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { OnboardingModal } from "@/components/employee/OnboardingModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  getMyOnboarding,
  markMyOnboardingModuleCompleted,
  updateMyOnboardingProgress,
} from "@/lib/api/onboarding";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import type { OnboardingMyOverviewResponse } from "@/types/onboarding";

interface TenantAdminLayoutProps {
  children: React.ReactNode;
}

type LoadOnboardingOptions = {
  autoOpenIfIncomplete?: boolean;
  silent?: boolean;
  oncePerSession?: boolean;
  showLoading?: boolean;
};

function applyOptimisticModuleComplete(
  overview: OnboardingMyOverviewResponse | null,
  moduleId: string
): OnboardingMyOverviewResponse | null {
  if (!overview) return overview;

  const nowIso = new Date().toISOString();
  let changed = false;

  const modules = overview.modules.map((module) => {
    if (module.id !== moduleId || module.completed) {
      return module;
    }

    changed = true;
    return {
      ...module,
      readPercent: 100,
      completed: true,
      completedAt: nowIso,
      lastViewedAt: nowIso,
    };
  });

  if (!changed) return overview;

  const totalModules = modules.length;
  const completedModules = modules.filter((module) => module.completed).length;
  const progressPercent = totalModules === 0
    ? 100
    : Math.round((completedModules * 100) / totalModules);

  return {
    ...overview,
    modules,
    completedModules,
    progressPercent,
    hasIncompleteModules: completedModules < totalModules,
  };
}

export function TenantAdminLayout({ children }: TenantAdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDashboardTab = pathname === "/tenant-admin";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showSubscriptionRequiredModal, setShowSubscriptionRequiredModal] =
    useState(false);
  const [onboardingOverview, setOnboardingOverview] =
    useState<OnboardingMyOverviewResponse | null>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);
  const [processingModuleId, setProcessingModuleId] = useState<string | null>(
    null
  );
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const autoOpenKey = "tenant-admin-onboarding-auto-opened";

  useEffect(() => {
    if (searchParams.get("subscriptionRequired") === "1") {
      setShowSubscriptionRequiredModal(true);
    }
  }, [searchParams]);

  const loadOnboarding = useCallback(async (options: LoadOnboardingOptions = {}) => {
    const shouldShowLoading = options.showLoading ?? true;
    if (shouldShowLoading) {
      setIsOnboardingLoading(true);
    }

    try {
      const overview = await getMyOnboarding();
      setOnboardingOverview(overview);

      if (options.autoOpenIfIncomplete && overview.hasIncompleteModules) {
        let canAutoOpen = true;
        if (options.oncePerSession) {
          const opened = sessionStorage.getItem(autoOpenKey) === "1";
          canAutoOpen = !opened;
          if (canAutoOpen) {
            sessionStorage.setItem(autoOpenKey, "1");
          }
        }

        if (canAutoOpen) {
          setShowOnboardingModal(true);
        }
      }

      return overview;
    } catch (error) {
      if (!options.silent) {
        alert(
          error instanceof Error
            ? error.message
            : isEn
              ? "Unable to load onboarding."
              : "Không tải được onboarding."
        );
      }
      return null;
    } finally {
      if (shouldShowLoading) {
        setIsOnboardingLoading(false);
      }
    }
  }, [isEn]);

  useEffect(() => {
    if (!isDashboardTab) {
      setShowOnboardingModal(false);
      return;
    }

    void loadOnboarding({
      autoOpenIfIncomplete: true,
      oncePerSession: true,
      silent: true,
    });
  }, [isDashboardTab, loadOnboarding]);

  const handleMarkModuleCompleted = useCallback(
    async (moduleId: string) => {
      const previousOverview = onboardingOverview;
      setOnboardingOverview((current) => applyOptimisticModuleComplete(current, moduleId));
      setProcessingModuleId(moduleId);

      try {
        await updateMyOnboardingProgress(moduleId, 100);
        await markMyOnboardingModuleCompleted(moduleId);
        await loadOnboarding({ silent: true, showLoading: false });
        return true;
      } catch (error) {
        setOnboardingOverview(previousOverview);
        alert(
          error instanceof Error
            ? error.message
            : isEn
              ? "Unable to update onboarding status."
              : "Không thể cập nhật trạng thái onboarding."
        );
        return false;
      } finally {
        setProcessingModuleId(null);
      }
    },
    [isEn, loadOnboarding, onboardingOverview]
  );

  const onboardingSummary = useMemo(() => {
    if (!onboardingOverview) {
      return {
        total: 0,
        completed: 0,
        progress: 0,
        remaining: 0,
        hasIncomplete: false,
      };
    }

    const remaining = Math.max(
      onboardingOverview.totalModules - onboardingOverview.completedModules,
      0
    );

    return {
      total: onboardingOverview.totalModules,
      completed: onboardingOverview.completedModules,
      progress: onboardingOverview.progressPercent,
      remaining,
      hasIncomplete: onboardingOverview.hasIncompleteModules,
    };
  }, [onboardingOverview]);

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-1 bg-linear-to-br from-zinc-100 via-white to-zinc-100 px-3 py-4 dark:from-black dark:via-black dark:to-black sm:px-5 sm:py-5 lg:px-8 lg:py-6">
      <TenantAdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main className="min-w-0 flex-1 px-0 py-2 sm:px-3 lg:px-4 lg:pl-72 xl:pl-72">
        <DashboardHeader 
          title={t.tenantAdmin}
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <div className="mx-auto mt-5 w-full min-w-0 max-w-[min(100%,88rem)] lg:mt-6">
          {isDashboardTab &&
            !isOnboardingLoading &&
            onboardingSummary.total > 0 &&
            onboardingSummary.hasIncomplete && (
            <section className="mb-6 overflow-hidden rounded-3xl border border-emerald-300/70 bg-linear-to-r from-emerald-50 via-white to-cyan-50 p-5 shadow-lg shadow-emerald-100/60 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:via-zinc-950 dark:to-cyan-950/30 dark:shadow-black/30">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-700/60 dark:bg-zinc-900/80 dark:text-emerald-300">
                    <AcademicCapIcon className="h-4 w-4" />
                    {isEn ? "Tenant Learning Hub" : "Lộ trình học tập tenant"}
                  </span>
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {isEn
                      ? "Onboarding roadmap for tenant teams"
                      : "Lộ trình onboarding cho đội ngũ tenant"}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {isEn
                      ? "Bilingual content with progress tracking per user."
                      : "Nội dung song ngữ Việt - Anh, theo dõi tiến độ theo từng người dùng."}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {isEn
                      ? `Completed ${onboardingSummary.completed}/${onboardingSummary.total} modules, ${onboardingSummary.remaining} remaining.`
                      : `Đã hoàn thành ${onboardingSummary.completed}/${onboardingSummary.total} module, còn ${onboardingSummary.remaining} module.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <SparklesIcon className="h-4 w-4" />
                  {isEn ? "Continue onboarding" : "Tiếp tục onboarding"}
                </button>
              </div>

              <div className="mt-4 h-2.5 w-full rounded-full bg-zinc-200/90 dark:bg-zinc-800">
                <div
                  className="h-2.5 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, onboardingSummary.progress))}%`,
                  }}
                />
              </div>
            </section>
          )}

          {isDashboardTab &&
            !isOnboardingLoading &&
            onboardingSummary.total > 0 &&
            !onboardingSummary.hasIncomplete && (
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowOnboardingModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
              >
                <SparklesIcon className="h-4 w-4" />
                {isEn ? "Review onboarding checklist" : "Xem lại checklist onboarding"}
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <OnboardingModal
        isOpen={showOnboardingModal}
        isLoading={isOnboardingLoading}
        overview={onboardingOverview}
        processingModuleId={processingModuleId}
        onClose={() => setShowOnboardingModal(false)}
        onMarkCompleted={handleMarkModuleCompleted}
      />

      {showSubscriptionRequiredModal && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/70" />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {isEn
                ? "Subscription required"
                : "Yêu cầu đăng ký gói"}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {isEn
                ? "You need an active subscription plan to access Chatbot and Documents."
                : "Bạn cần có gói đăng ký đang hoạt động để truy cập AI Chatbot và Tài liệu."}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSubscriptionRequiredModal(false);
                  router.replace(pathname);
                }}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {isEn ? "Close" : "Đóng"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubscriptionRequiredModal(false);
                  router.push("/tenant-admin/subscription");
                }}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                {isEn ? "Go to Subscription" : "Đi tới Gói đăng ký"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
