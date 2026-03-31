"use client";

import { useState, useEffect } from "react";
import { Home, MessageSquare, Users, User, LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/lib/language-store";
import { clearAuth } from "@/lib/auth-store";
import { logout } from "@/lib/api/auth";
import { getAccessToken, getStoredUser } from "@/lib/auth-store";
import { getProfile } from "@/lib/api/profile";

interface NavigationSidebarProps {
  activeView: "chat" | "search" | "analytics";
  onViewChange: (view: "chat" | "search" | "analytics") => void;
  historyOpen: boolean;
  onToggleHistory: () => void;
}

export function NavigationSidebar({ 
  activeView, 
  onViewChange,
  historyOpen,
  onToggleHistory
}: NavigationSidebarProps) {
  const { language } = useLanguageStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const currentUser = getStoredUser();
  const [displayName, setDisplayName] = useState(
    currentUser?.fullName?.trim() ||
      currentUser?.email?.split("@")[0] ||
      "User"
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userInitial = (displayName.trim()[0] || "U").toUpperCase();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile?.fullName?.trim()) {
          setDisplayName(profile.fullName.trim());
        }
      })
      .catch(() => {
        // Keep fallback from auth store when profile API fails.
      });
  }, []);

  // Glean-style navigation - simple icons only
  const navigation = [
    { 
      id: "chat" as const, 
      icon: MessageSquare, 
      label: language === "en" ? "Chat" : "Trò chuyện"
    },
    { 
      id: "search" as const, 
      icon: Home, 
      label: language === "en" ? "Search" : "Tìm kiếm"
    },
    { 
      id: "analytics" as const, 
      icon: Users, 
      label: language === "en" ? "Analytics" : "Phân tích"
    },
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

  return (
    <aside className="z-40 flex w-24 flex-col items-center border-r border-zinc-200 bg-white py-5 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Logo */}
      <div className="group relative mb-7">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-500/30"
          title={displayName}
        >
          {userInitial}
        </div>
        <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-700">
          {displayName}
        </span>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-1 flex-col gap-4">
        {navigation.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`group relative flex w-16 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 transition-colors ${
                isActive 
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" 
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
              title={item.label}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mb-3 mt-2 w-14 border-t border-zinc-200 dark:border-zinc-800" />
      <button
        onClick={() => {
          onViewChange("chat");
          onToggleHistory();
        }}
        className="group relative mb-3 flex w-16 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        title={language === "en" ? "Create chat" : "Tạo chat"}
      >
        <Plus className="h-6 w-6" />
        <span className="text-[10px] font-medium leading-none">
          {language === "en" ? "Create" : "Tạo chat"}
        </span>
      </button>

      {/* User Avatar */}
      <div className="relative mt-1">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          title={mounted ? displayName : "User"}
        >
          <User className="h-5 w-5" />
        </button>

        {/* User menu */}
        {showUserMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute bottom-full left-full z-50 mb-2 ml-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <div className="truncate text-sm font-medium text-zinc-900 dark:text-white">{displayName}</div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{currentUser?.email}</div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <User className="h-4 w-4" />
                  {language === "en" ? "Profile" : "Hồ sơ"}
                </button>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  {language === "en" ? "Logout" : "Đăng xuất"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
