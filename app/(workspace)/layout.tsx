"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NavigationSidebar, type ChatbotNavView } from "@/components/chat/NavigationSidebar";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { OnboardingModal } from "@/components/employee/OnboardingModal";
import { useWorkspaceStore } from "@/lib/workspace-store";
import { getLoginSessionId, getStoredUser } from "@/lib/auth-store";
import {
  getMyOnboarding,
  markMyOnboardingModuleCompleted,
  updateMyOnboardingProgress,
} from "@/lib/api/onboarding";
import type { OnboardingMyOverviewResponse } from "@/types/onboarding";

/** Apply an optimistic completion so the UI reflects the action before the server confirms. */
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

/**
 * Decide which main-nav icon should be highlighted.
 * - `/chatbot-new` (default) → Chat
 * - `/chatbot-new?view=search` → Documents (smart search)
 * - `/chatbot-new?view=analytics` → Analytics
 * - `/document-dashboard` → null (Doc hub shortcut is highlighted instead)
 */
function resolveSidebarActiveView(
  pathname: string,
  view: string | null
): ChatbotNavView | null {
  if (pathname === "/chatbot-new") {
    if (view === "analytics") return "analytics";
    if (view === "search") return "search";
    return "chat";
  }
  if (pathname === "/document-dashboard") {
    return null;
  }
  return "chat";
}

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isChatHistoryOpen = useWorkspaceStore((state) => state.isChatHistoryOpen);
  const setChatHistoryOpen = useWorkspaceStore((state) => state.setChatHistoryOpen);
  const toggleChatHistory = useWorkspaceStore((state) => state.toggleChatHistory);

  const view = searchParams.get("view");
  const mode = searchParams.get("mode");
  const activeView = resolveSidebarActiveView(pathname ?? "", view);
  const isDocumentDashboardActive = pathname === "/document-dashboard";

  const currentUser = getStoredUser();
  const normalizedAuthorities = useMemo(
    () => (currentUser?.roles ?? []).map((role) => role.trim().toUpperCase()),
    [currentUser?.roles]
  );
  const hasDocumentAll = normalizedAuthorities.includes("DOCUMENT_ALL");
  const canViewDocuments =
    hasDocumentAll ||
    normalizedAuthorities.includes("DOCUMENT_READ") ||
    normalizedAuthorities.includes("DOCUMENT_WRITE") ||
    normalizedAuthorities.includes("DOCUMENT_DELETE");
  const canViewAnalytics =
    normalizedAuthorities.includes("ANALYTICS_VIEW") ||
    normalizedAuthorities.includes("ANALYTICS_EXPORT") ||
    normalizedAuthorities.some(
      (role) =>
        role.includes("TENANT_ADMIN") ||
        role.includes("SUPER_ADMIN") ||
        role.includes("STAFF")
    );
  const isEmployeeUser = useMemo(
    () => (currentUser?.roles ?? []).some((role) => role.includes("EMPLOYEE")),
    [currentUser?.roles]
  );

  const [showSettings, setShowSettings] = useState(false);

  // Onboarding state lives at the shell level so the Checklist shortcut and modal
  // are available across every view inside the workspace, not only inside /chatbot-new.
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingOverview, setOnboardingOverview] =
    useState<OnboardingMyOverviewResponse | null>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
  const [processingModuleId, setProcessingModuleId] = useState<string | null>(null);
  const [didAutoOpenOnboardingSession, setDidAutoOpenOnboardingSession] = useState<string | null>(null);
  const onboardingAutoOpenStorageKey = useMemo(() => {
    const sessionId = getLoginSessionId();
    if (!sessionId) return null;
    return `workspace-onboarding-auto-opened:${sessionId}`;
  }, [didAutoOpenOnboardingSession]);

  const loadOnboarding = useCallback(
    async (autoOpenIfIncomplete: boolean, oncePerSession: boolean) => {
      if (!isEmployeeUser) return;
      setIsOnboardingLoading(true);
      try {
        const overview = await getMyOnboarding();
        setOnboardingOverview(overview);
        if (autoOpenIfIncomplete && overview.hasIncompleteModules) {
          let canAutoOpen = true;
          if (oncePerSession && onboardingAutoOpenStorageKey) {
            const opened = sessionStorage.getItem(onboardingAutoOpenStorageKey) === "1";
            canAutoOpen = !opened;
            if (canAutoOpen) {
              sessionStorage.setItem(onboardingAutoOpenStorageKey, "1");
            }
          }
          if (canAutoOpen) {
            setShowOnboardingModal(true);
          }
        }
      } catch {
        setOnboardingOverview(null);
      } finally {
        setIsOnboardingLoading(false);
      }
    },
    [isEmployeeUser, onboardingAutoOpenStorageKey]
  );

  useEffect(() => {
    if (!isEmployeeUser) return;
    const sessionId = getLoginSessionId();
    if (!sessionId || didAutoOpenOnboardingSession === sessionId) {
      void loadOnboarding(false, false);
      return;
    }
    setDidAutoOpenOnboardingSession(sessionId);
    void loadOnboarding(true, true);
  }, [didAutoOpenOnboardingSession, isEmployeeUser, loadOnboarding]);

  const handleMarkModuleCompleted = useCallback(
    async (moduleId: string) => {
      const previousOverview = onboardingOverview;
      setOnboardingOverview((current) => applyOptimisticModuleComplete(current, moduleId));
      setProcessingModuleId(moduleId);
      try {
        await updateMyOnboardingProgress(moduleId, 100);
        await markMyOnboardingModuleCompleted(moduleId);
        await loadOnboarding(false, false);
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

  const onboardingSummary = useMemo(() => {
    if (!onboardingOverview) {
      return { total: 0, completed: 0, hasIncomplete: false };
    }
    return {
      total: onboardingOverview.totalModules,
      completed: onboardingOverview.completedModules,
      hasIncomplete: onboardingOverview.hasIncompleteModules,
    };
  }, [onboardingOverview]);

  const handleSidebarViewChange = useCallback(
    (nextView: ChatbotNavView) => {
      if (nextView === "chat") {
        router.push("/chatbot-new");
        return;
      }
      if (nextView === "search") {
        setChatHistoryOpen(false);
        router.push("/chatbot-new?view=search");
        return;
      }
      if (nextView === "analytics") {
        setChatHistoryOpen(false);
        router.push("/chatbot-new?view=analytics");
      }
    },
    [router, setChatHistoryOpen]
  );

  const handleToggleHistory = useCallback(() => {
    // Clicking the Chat icon from another view routes to chat and opens the history panel.
    if (activeView !== "chat") {
      setChatHistoryOpen(true);
      router.push("/chatbot-new");
      return;
    }
    toggleChatHistory();
  }, [activeView, router, setChatHistoryOpen, toggleChatHistory]);

  // Animate the right pane whenever the shell surfaces a different view.
  const viewKey = `${pathname}?${view ?? ""}&mode=${mode ?? ""}`;
  const shouldReserveChatSidebarSpace = activeView === "chat" && isChatHistoryOpen;

  return (
    <div className="relative flex h-dvh min-h-0 overflow-hidden bg-zinc-100 dark:bg-[#060607]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-8%,rgba(139,92,246,0.14),transparent_55%)] dark:bg-[radial-gradient(ellipse_85%_50%_at_50%_-10%,rgba(124,58,237,0.22),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_60%,rgba(16,185,129,0.06),transparent_45%)] dark:bg-[radial-gradient(ellipse_55%_45%_at_100%_55%,rgba(16,185,129,0.1),transparent_50%)]"
        aria-hidden
      />

      <NavigationSidebar
        activeView={activeView}
        onViewChange={handleSidebarViewChange}
        onToggleHistory={handleToggleHistory}
        canViewDocuments={canViewDocuments}
        canViewAnalytics={canViewAnalytics}
        isDocumentDashboardActive={isDocumentDashboardActive}
        showOnboardingShortcut={isEmployeeUser}
        onboardingLoading={isOnboardingLoading}
        onboardingTotal={onboardingSummary.total}
        onboardingCompleted={onboardingSummary.completed}
        onboardingHasIncomplete={onboardingSummary.hasIncomplete}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main
        className={`relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[padding] duration-300 ease-out ${
          shouldReserveChatSidebarSpace ? "pl-64" : "pl-0"
        }`}
      >
        <div
          key={viewKey}
          className="animate-view-enter relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          {children}
        </div>
      </main>

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

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
