"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Users,
  User,
  LogOut,
  ClipboardCheck,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/lib/language-store";
import { clearAuth, getAccessToken, getStoredUser } from "@/lib/auth-store";
import { logout } from "@/lib/api/auth";
import { getProfile } from "@/lib/api/profile";
import { useAppTheme } from "@/lib/use-app-theme";

export type ChatbotNavView = "chat" | "search" | "analytics";

interface NavigationSidebarProps {
  activeView: ChatbotNavView;
  onViewChange: (view: ChatbotNavView) => void;
  onToggleHistory: () => void;
  showOnboardingShortcut?: boolean;
  onboardingLoading?: boolean;
  onboardingTotal?: number;
  onboardingCompleted?: number;
  onboardingHasIncomplete?: boolean;
  onOpenOnboarding?: () => void;
}

export function NavigationSidebar({
  activeView,
  onViewChange,
  onToggleHistory,
  showOnboardingShortcut = false,
  onboardingLoading = false,
  onboardingTotal = 0,
  onboardingCompleted = 0,
  onboardingHasIncomplete = false,
  onOpenOnboarding,
}: NavigationSidebarProps) {
  const { language } = useLanguageStore();
  const { theme, toggleTheme } = useAppTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const currentUser = getStoredUser();
  const [displayName, setDisplayName] = useState(
    currentUser?.email?.split("@")[0] || "User"
  );
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getProfile()
      .then((p) => {
        if (p?.fullName?.trim()) setDisplayName(p.fullName.trim());
      })
      .catch(() => {});
  }, []);

  const isEn = language === "en";
  const isTenantAdmin = (currentUser?.roles ?? []).some((role) =>
    role.includes("TENANT_ADMIN")
  );

  const navigation: {
    id: ChatbotNavView;
    icon: typeof MessageSquare;
    caption: string;
  }[] = [
    { id: "chat", icon: MessageSquare, caption: isEn ? "Chat" : "Trò chuyện" },
    { id: "search", icon: Search, caption: isEn ? "Documents" : "Tài liệu" },
    { id: "analytics", icon: Users, caption: isEn ? "Analytics" : "Phân tích" },
  ];

  const handleLogout = async () => {
    const token = getAccessToken();
    try {
      if (token) await logout(token);
    } finally {
      clearAuth();
      router.push("/login");
      router.refresh();
    }
  };

  const nameInitial =
    displayName.trim().charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    "?";

  return (
    <aside className="relative z-50 flex h-full min-h-0 w-16 shrink-0 flex-col items-stretch border-r border-zinc-200 bg-white py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div
        className="group relative mx-auto mb-4 flex shrink-0 cursor-default flex-col items-center gap-1"
        title={displayName}
        aria-label={displayName}
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
          <span className="text-sm font-bold">{nameInitial}</span>
        </div>
        <span className="pointer-events-none absolute left-full top-1/2 z-[60] ml-2 max-w-[14rem] -translate-y-1/2 truncate rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-zinc-700">
          {displayName}
        </span>
      </div>

      <nav
        className="flex min-h-0 flex-1 flex-col items-center justify-start gap-2.5 px-1 pt-2"
        aria-label={isEn ? "Main navigation" : "Điều hướng chính"}
      >
        {navigation.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === "chat") {
                  onToggleHistory();
                  onViewChange("chat");
                  return;
                }
                onViewChange(item.id);
              }}
              title={item.caption}
              className="flex flex-col items-center gap-1 border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 dark:focus-visible:ring-offset-zinc-950"
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-700/80"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2} />
              </span>
              <span
                className={`max-w-[3.75rem] text-center text-[8px] font-medium leading-tight tracking-tight ${
                  isActive ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {item.caption}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3 border-t border-zinc-200/90 pt-3 dark:border-zinc-800">
        {isTenantAdmin ? (
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => router.push("/tenant-admin")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              title={isEn ? "Tenant dashboard" : "Dashboard tenant"}
            >
              <LayoutDashboard className="h-5 w-5" />
            </button>
            <span className="max-w-[3.75rem] text-center text-[8px] font-medium leading-tight text-zinc-500 dark:text-zinc-400">
              {isEn ? "Dashboard" : "Bảng tin"}
            </span>
          </div>
        ) : null}

        {showOnboardingShortcut ? (
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={onOpenOnboarding}
              disabled={onboardingLoading || onboardingTotal === 0}
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                onboardingHasIncomplete
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              } disabled:cursor-not-allowed disabled:opacity-50`}
              title={
                onboardingLoading
                  ? isEn
                    ? "Loading onboarding..."
                    : "Đang tải onboarding..."
                  : onboardingTotal > 0
                    ? `Onboarding ${onboardingCompleted}/${onboardingTotal}`
                    : isEn
                      ? "Onboarding not configured"
                      : "Onboarding chưa cấu hình"
              }
            >
              <ClipboardCheck className="h-5 w-5" />
              {!onboardingLoading && onboardingHasIncomplete ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
              ) : null}
            </button>
            <span className="max-w-[3.75rem] text-center text-[8px] font-medium leading-tight text-zinc-500 dark:text-zinc-400">
              Checklist
            </span>
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            title={
              theme === "dark"
                ? isEn
                  ? "Light mode"
                  : "Chế độ sáng"
                : isEn
                  ? "Dark mode"
                  : "Chế độ tối"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <span className="max-w-[3.75rem] text-center text-[8px] font-medium leading-tight text-zinc-500 dark:text-zinc-400">
            {isEn ? "Theme" : "Giao diện"}
          </span>
        </div>

        <div className="relative flex flex-col items-center gap-1 pb-1">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex size-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            title={mounted ? displayName : "User"}
          >
            <User className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} />
          </button>
          <span className="max-w-[3.75rem] text-center text-[8px] font-medium leading-tight text-zinc-500 dark:text-zinc-400">
            {isEn ? "Account" : "Hồ sơ"}
          </span>

          {showUserMenu ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40"
                aria-label="Close menu"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute bottom-full left-full z-50 mb-2 ml-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                  <div className="truncate text-sm font-medium text-zinc-900 dark:text-white">{displayName}</div>
                  <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{currentUser?.email}</div>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/profile");
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <User className="h-4 w-4" />
                    {isEn ? "Profile" : "Hồ sơ"}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" />
                    {isEn ? "Logout" : "Đăng xuất"}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </aside>
  );
}