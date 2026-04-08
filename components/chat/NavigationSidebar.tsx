"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Users, Plus, ClipboardCheck } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { getStoredUser } from "@/lib/auth-store";
import { getProfile } from "@/lib/api/profile";
import { UserMenu } from "./UserMenu";

export type ChatbotNavView = "chat" | "search" | "analytics";

interface NavigationSidebarProps {
  activeView: ChatbotNavView;
  onViewChange: (view: ChatbotNavView) => void;
  historyOpen: boolean;
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
  historyOpen,
  onToggleHistory,
  showOnboardingShortcut = false,
  onboardingLoading = false,
  onboardingTotal = 0,
  onboardingCompleted = 0,
  onboardingHasIncomplete = false,
  onOpenOnboarding,
}: NavigationSidebarProps) {
  const { language } = useLanguageStore();
  const currentUser = getStoredUser();
  const [displayName, setDisplayName] = useState(
    currentUser?.email?.split("@")[0] || "User"
  );

  useEffect(() => {
    getProfile()
      .then((p) => {
        if (p?.fullName?.trim()) setDisplayName(p.fullName.trim());
      })
      .catch(() => {});
  }, []);

  const isEn = language === "en";

  /** Chat → Tài liệu → Phân tích; mỗi mục: ô vuông icon + chú thích phía dưới */
  const navigation: {
    id: ChatbotNavView;
    icon: typeof MessageSquare;
    caption: string;
  }[] = [
    {
      id: "chat",
      icon: MessageSquare,
      caption: isEn ? "Chat" : "Trò chuyện",
    },
    {
      id: "search",
      icon: Search,
      caption: isEn ? "Documents" : "Tài liệu",
    },
    {
      id: "analytics",
      icon: Users,
      caption: isEn ? "Analytics" : "Phân tích",
    },
  ];

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
              onClick={() => onViewChange(item.id)}
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
                    ? isEn
                      ? `Onboarding ${onboardingCompleted}/${onboardingTotal}`
                      : `Onboarding ${onboardingCompleted}/${onboardingTotal}`
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
              {isEn ? "Checklist" : "Checklist"}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={onToggleHistory}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
              historyOpen
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            }`}
            title={isEn ? "Create chat — open history" : "Tạo chat — mở lịch sử"}
            aria-pressed={historyOpen}
          >
            <Plus className="h-5 w-5" />
          </button>
          <span
            className={`max-w-[3.75rem] text-center text-[8px] font-medium leading-tight ${
              historyOpen ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {isEn ? "New chat" : "Tạo chat"}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 pb-1">
          <UserMenu />
          <span className="max-w-[3.75rem] text-center text-[8px] font-medium leading-tight text-zinc-500 dark:text-zinc-400">
            {isEn ? "Menu" : "Menu"}
          </span>
        </div>
      </div>
    </aside>
  );
}
