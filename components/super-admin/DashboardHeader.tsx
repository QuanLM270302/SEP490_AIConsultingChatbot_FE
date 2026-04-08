"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, User, LogOut, Settings, Sun, Moon, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { getAccessToken, clearAuth, getStoredUser } from "@/lib/auth-store";
import { getProfile } from "@/lib/api/profile";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { useAppTheme } from "@/lib/use-app-theme";

const SUPER_FALLBACK_EMAIL = "superadmin@system.vn";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, toggleTheme } = useAppTheme();
  const [displayName, setDisplayName] = useState(
    () => SUPER_FALLBACK_EMAIL.split("@")[0] || "Super Admin"
  );
  const [displayEmail, setDisplayEmail] = useState(SUPER_FALLBACK_EMAIL);
  const { language, toggleLanguage } = useLanguageStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  useEffect(() => {
    const email = getStoredUser()?.email ?? SUPER_FALLBACK_EMAIL;
    setDisplayEmail(email);
    setDisplayName(email.split("@")[0] || "Super Admin");
  }, []);

  useEffect(() => {
    getProfile()
      .then((profile) => {
        if (profile?.fullName?.trim()) {
          setDisplayName(profile.fullName.trim());
        }
      })
      .catch(() => {
        // Keep fallback from auth store email when profile request fails.
      });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      const token = getAccessToken();
      if (token) {
        await logout(token);
      }
      clearAuth();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear auth anyway
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        type="button"
        className="rounded-2xl bg-white p-3 text-zinc-700 shadow-sm shadow-green-100/60 dark:bg-zinc-950 dark:text-zinc-400 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">{t.openSidebar}</span>
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-3">
        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm shadow-green-100/60 transition hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden text-sm font-semibold text-zinc-900 dark:text-white lg:block">
              {displayName}
            </span>
            <svg
              className={`hidden h-4 w-4 text-zinc-400 transition-transform lg:block ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              {/* User Info */}
              <div className="border-b border-zinc-200 bg-gradient-to-br from-emerald-50 to-white px-4 py-3 dark:border-zinc-800 dark:from-emerald-950/20 dark:to-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{displayName}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">{displayEmail}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <User className="h-4 w-4" />
                  <span>{t.profile}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t.settings}</span>
                </button>

                <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-800" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-zinc-900">
            {/* Header */}
            <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Settings</h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 p-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{t.theme}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {theme === 'light' ? t.lightMode : t.darkMode}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-emerald-500' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{t.language}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {language === 'en' ? 'English' : 'Tiếng Việt'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleLanguage}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-600"
                >
                  {language === 'en' ? 'EN' : 'VI'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
