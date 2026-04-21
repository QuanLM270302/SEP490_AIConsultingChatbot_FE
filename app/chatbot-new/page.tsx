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
import { getCurrentUserPermissions, getProfile } from "@/lib/api/profile";
import type { OnboardingMyOverviewResponse } from "@/types/onboarding";
import { getAccessToken, getStoredUser } from "@/lib/auth-store";
import { tryRefreshAuth } from "@/lib/auth-store";

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

function decodePermissionsFromJwt(token: string | null): string[] {
  if (!token) return [];
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return [];
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payloadText = atob(padded);
    const payload = JSON.parse(payloadText) as Record<string, unknown>;
    const candidates = [
      payload.permissions,
      payload.authorities,
      payload.scopes,
      payload.scope,
    ];
    for (const entry of candidates) {
      if (Array.isArray(entry)) {
        return entry.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
      }
      if (typeof entry === "string" && entry.trim().length > 0) {
        return entry
          .split(/[,\s]+/)
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }
    return [];
  } catch {
    return [];
  }
}

function extractPermissionCodes(authorities: string[] | undefined): string[] {
  if (!authorities || authorities.length === 0) return [];
  return authorities
    .map((value) => value.trim())
    .filter((value) => value.length > 0 && !value.startsWith("ROLE_"));
}

export default function ChatbotNewPage() {
  const [activeView, setActiveView] = useState<"chat" | "search" | "analytics">("chat");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  /** Bumps when navigating from chat so SearchView picks up a new initialQuery reliably */
  const [searchNavKey, setSearchNavKey] = useState(0);
  const currentUser = getStoredUser();
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const isEmployeeUser = useMemo(
    () => (currentUser?.roles ?? []).some((role) => role.includes("EMPLOYEE")),
    [currentUser?.roles]
  );
  const roleCodes = useMemo(
    () => (currentUser?.roles ?? []).map((role) => role.toUpperCase()),
    [currentUser?.roles]
  );
  const isPrivilegedRole = useMemo(
    () =>
      roleCodes.some(
        (role) =>
          role.includes("TENANT_ADMIN") ||
          role.includes("SUPER_ADMIN") ||
          role.includes("STAFF")
      ),
    [roleCodes]
  );

  const hasPermission = useCallback(
    (code: string) => {
      if (isPrivilegedRole) return true;
      const normalized = code.toUpperCase();
      const perms = userPermissions.map((p) => p.toUpperCase());
      if (perms.includes(normalized)) return true;
      if (normalized.startsWith("DOCUMENT_") && perms.includes("DOCUMENT_ALL")) return true;
      if (normalized.startsWith("ANALYTICS_") && perms.includes("ANALYTICS_EXPORT")) return true;
      return false;
    },
    [isPrivilegedRole, userPermissions]
  );
  const normalizedPermissions = useMemo(
    () => userPermissions.map((permission) => permission.toUpperCase()),
    [userPermissions]
  );
  const hasDocumentAll = normalizedPermissions.includes("DOCUMENT_ALL");
  const hasAnyDocumentPermission =
    hasDocumentAll ||
    normalizedPermissions.includes("DOCUMENT_READ") ||
    normalizedPermissions.includes("DOCUMENT_WRITE") ||
    normalizedPermissions.includes("DOCUMENT_DELETE");
  const canViewDocuments = hasAnyDocumentPermission;
  const canViewAnalytics = hasPermission("ANALYTICS_VIEW");
  const documentPermissionTabs = useMemo(() => {
    const tabs: string[] = [];
    if (hasDocumentAll || normalizedPermissions.includes("DOCUMENT_READ")) {
      tabs.push("DOCUMENT_READ");
    }
    if (hasDocumentAll || normalizedPermissions.includes("DOCUMENT_WRITE")) {
      tabs.push("DOCUMENT_WRITE");
    }
    if (hasDocumentAll || normalizedPermissions.includes("DOCUMENT_DELETE")) {
      tabs.push("DOCUMENT_DELETE");
    }
    return tabs;
  }, [hasDocumentAll, normalizedPermissions]);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingOverview, setOnboardingOverview] =
    useState<OnboardingMyOverviewResponse | null>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);
  const [processingModuleId, setProcessingModuleId] = useState<string | null>(null);

  const goToSearch = useCallback((query?: string) => {
    if (query) setSearchQuery(query);
    setSearchNavKey((k) => k + 1);
    setActiveView("search");
    setIsHistoryOpen(false);
  }, []);

  const handleChatNavClick = useCallback(() => {
    setActiveView("chat");
    setIsHistoryOpen((prev) => (activeView === "chat" ? !prev : true));
  }, [activeView]);

  const handleViewChange = useCallback((view: "chat" | "search" | "analytics") => {
    setActiveView(view);
    if (view !== "chat") {
      setIsHistoryOpen(false);
    }
  }, []);

  const loadPermissions = useCallback(async () => {
    await tryRefreshAuth();
    let resolvedPermissions: string[] = [];
    const latestStoredUser = getStoredUser();
    const storedAuthorities = extractPermissionCodes(latestStoredUser?.roles);
    if (storedAuthorities.length > 0) {
      resolvedPermissions = storedAuthorities;
    }

    try {
      const permissions = await getCurrentUserPermissions();
      if (permissions.length > 0) {
        resolvedPermissions = permissions;
      }
    } catch {
      // fallback below
    }

    if (resolvedPermissions.length === 0) {
      try {
        const profile = await getProfile();
        const profilePermissions = (profile.permissions ?? []).filter(Boolean);
        if (profilePermissions.length > 0) {
          resolvedPermissions = profilePermissions;
        }
      } catch {
        // fallback below
      }
    }

    if (resolvedPermissions.length === 0) {
      const jwtPermissions = decodePermissionsFromJwt(getAccessToken());
      if (jwtPermissions.length > 0) {
        resolvedPermissions = jwtPermissions;
      }
    }

    setUserPermissions(resolvedPermissions);
  }, []);

  useEffect(() => {
    void loadPermissions();
  }, [loadPermissions]);

  useEffect(() => {
    const PERMISSION_SYNC_MS = 5000;
    const intervalId = window.setInterval(() => {
      void loadPermissions();
    }, PERMISSION_SYNC_MS);

    const syncOnReturn = () => {
      if (document.visibilityState === "visible") {
        void loadPermissions();
      }
    };
    const syncOnFocus = () => {
      void loadPermissions();
    };

    document.addEventListener("visibilitychange", syncOnReturn);
    window.addEventListener("focus", syncOnFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", syncOnReturn);
      window.removeEventListener("focus", syncOnFocus);
    };
  }, [loadPermissions]);

  useEffect(() => {
    if (activeView === "analytics" && !canViewAnalytics) {
      setActiveView("chat");
      return;
    }
    if (activeView === "search" && !canViewDocuments) {
      setActiveView("chat");
    }
  }, [activeView, canViewAnalytics, canViewDocuments]);

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
        onViewChange={handleViewChange}
        onToggleHistory={handleChatNavClick}
        canViewDocuments={canViewDocuments}
        canViewAnalytics={canViewAnalytics}
        showOnboardingShortcut={isEmployeeUser}
        onboardingLoading={isOnboardingLoading}
        onboardingTotal={onboardingSummary.total}
        onboardingCompleted={onboardingSummary.completed}
        onboardingHasIncomplete={onboardingSummary.hasIncomplete}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
      />

      <main
        className={`relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-[padding] duration-300 ease-out ${
          isHistoryOpen ? "lg:pl-64" : "pl-0"
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
            <SearchView
              key={`${searchNavKey}-${searchQuery}`}
              initialQuery={searchQuery}
              permissionTabs={documentPermissionTabs}
            />
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
