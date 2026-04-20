"use client";

import { TenantAdminSidebar } from "./TenantAdminSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OnboardingModal } from "@/components/employee/OnboardingModal";
import { motion } from "framer-motion";
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
    <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-x-hidden bg-linear-to-br from-zinc-100 via-white to-zinc-100 dark:from-black dark:via-black dark:to-black">
      <div className="sticky top-0 z-50 min-w-0 border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-5 lg:pl-72 lg:pr-8">
        <DashboardHeader
          title={t.tenantAdmin}
          onMenuClick={() => setSidebarOpen(true)}
          onOpenOnboarding={() => setShowOnboardingModal(true)}
          onboardingButtonLabel={isEn ? "Onboarding" : "Lộ trình onboarding"}
          onboardingBadgeLabel={
            !isOnboardingLoading && onboardingSummary.total > 0
              ? `${onboardingSummary.completed}/${onboardingSummary.total}`
              : null
          }
          showOnboardingButton={isDashboardTab}
        />
      </div>

      <div className="relative flex min-h-0 flex-1 px-3 pt-0 pb-4 sm:px-5 sm:pb-5 lg:pr-8 lg:pl-0 lg:pb-6">
        <TenantAdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <main className="min-w-0 flex-1 px-0 py-2 sm:px-3 lg:border-l lg:border-zinc-200/80 lg:px-4 lg:pl-72 dark:lg:border-zinc-800 xl:pl-72">
          <div className="mx-auto mt-1 w-full min-w-0 max-w-[min(100%,88rem)] lg:mt-2">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

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
