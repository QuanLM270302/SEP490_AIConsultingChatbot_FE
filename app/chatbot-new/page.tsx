"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { NavigationSidebar } from "@/components/chat/NavigationSidebar";
import { ChatView } from "@/components/chat/ChatView";
import { SearchView } from "@/components/chat/SearchView";
import { ChatbotAnalyticsView } from "@/components/chat/ChatbotAnalyticsView";
import { ChatbotNewHeader } from "@/components/chat/ChatbotNewHeader";
import { OnboardingModal } from "@/components/employee/OnboardingModal";
import {
  getMyOnboarding,
  markMyOnboardingModuleCompleted,
  updateMyOnboardingProgress,
} from "@/lib/api/onboarding";
import type { OnboardingMyOverviewResponse } from "@/types/onboarding";
import { getStoredUser } from "@/lib/auth-store";

function applyOptimisticModuleComplete(
  overview: OnboardingMyOverviewResponse | null,
  moduleId: string
): OnboardingMyOverviewResponse | null {
  if (!overview) return overview;
  const nowIso = new Date().toISOString();
  let changed = false;

  const modules = overview.modules.map((module) => {
    if (module.id !== moduleId || module.completed) return module;
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
  const progressPercent =
    totalModules === 0 ? 100 : Math.round((completedModules * 100) / totalModules);

  return {
    ...overview,
    modules,
    completedModules,
    progressPercent,
    hasIncompleteModules: completedModules < totalModules,
  };
}

export default function ChatbotNewPage() {
  const [activeView, setActiveView] = useState<"chat" | "search" | "analytics">("chat");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  /** Bumps when navigating from chat so SearchView picks up a new initialQuery reliably */
  const [searchNavKey, setSearchNavKey] = useState(0);
  const currentUser = getStoredUser();
  const isEmployeeUser = useMemo(
    () => (currentUser?.roles ?? []).some((role) => role.includes("EMPLOYEE")),
    [currentUser?.roles]
  );
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingOverview, setOnboardingOverview] =
    useState<OnboardingMyOverviewResponse | null>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
  const [processingModuleId, setProcessingModuleId] = useState<string | null>(null);

  const goToSearch = useCallback((query?: string) => {
    if (query) setSearchQuery(query);
    setSearchNavKey((k) => k + 1);
    setActiveView("search");
  }, []);

  const loadOnboarding = useCallback(
    async (autoOpenIfIncomplete: boolean) => {
      if (!isEmployeeUser) return;
      setIsOnboardingLoading(true);
      try {
        const overview = await getMyOnboarding();
        setOnboardingOverview(overview);
        if (autoOpenIfIncomplete && overview.hasIncompleteModules) {
          setShowOnboardingModal(true);
        }
      } catch {
        setOnboardingOverview(null);
      } finally {
        setIsOnboardingLoading(false);
      }
    },
    [isEmployeeUser]
  );

  useEffect(() => {
    void loadOnboarding(true);
  }, [loadOnboarding]);

  const onboardingSummary = useMemo(() => {
    if (!onboardingOverview) {
      return { total: 0, completed: 0, progress: 0, hasIncomplete: false };
    }
    return {
      total: onboardingOverview.totalModules,
      completed: onboardingOverview.completedModules,
      progress: onboardingOverview.progressPercent,
      hasIncomplete: onboardingOverview.hasIncompleteModules,
    };
  }, [onboardingOverview]);

  const handleMarkModuleCompleted = useCallback(
    async (moduleId: string) => {
      const previousOverview = onboardingOverview;
      setOnboardingOverview((current) => applyOptimisticModuleComplete(current, moduleId));
      setProcessingModuleId(moduleId);
      try {
        await updateMyOnboardingProgress(moduleId, 100);
        await markMyOnboardingModuleCompleted(moduleId);
        await loadOnboarding(false);
        return true;
      } catch {
        setOnboardingOverview(previousOverview);
        return false;
      } finally {
        setProcessingModuleId(null);
      }
    },
    [loadOnboarding, onboardingOverview]
  );

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <NavigationSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        historyOpen={isHistoryOpen}
        onToggleHistory={() => setIsHistoryOpen((v) => !v)}
        showOnboardingShortcut={isEmployeeUser}
        onboardingLoading={isOnboardingLoading}
        onboardingTotal={onboardingSummary.total}
        onboardingCompleted={onboardingSummary.completed}
        onboardingHasIncomplete={onboardingSummary.hasIncomplete}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
      />

      <main
        className={`relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[padding] duration-300 ease-out ${
          isHistoryOpen ? "pl-64" : "pl-0"
        }`}
      >
        <ChatbotNewHeader onSmartSearch={() => goToSearch()} />

        <div className="relative z-0 min-h-0 flex-1 overflow-hidden">
          {activeView === "chat" && (
            <ChatView
              isHistoryOpen={isHistoryOpen}
              onToggleHistory={() => setIsHistoryOpen((v) => !v)}
              onNavigateToSearch={(query) => goToSearch(query)}
            />
          )}
          {activeView === "search" && (
            <SearchView key={`${searchNavKey}-${searchQuery}`} initialQuery={searchQuery} />
          )}
          {activeView === "analytics" && <ChatbotAnalyticsView />}
        </div>

        {isEmployeeUser ? (
          <OnboardingModal
            isOpen={showOnboardingModal}
            isLoading={isOnboardingLoading}
            overview={onboardingOverview}
            processingModuleId={processingModuleId}
            onClose={() => setShowOnboardingModal(false)}
            onMarkCompleted={handleMarkModuleCompleted}
          />
        ) : null}
      </main>
    </div>
  );
}
