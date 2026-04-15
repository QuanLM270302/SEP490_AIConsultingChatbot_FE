"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, Globe, Sun, X, Menu } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { getStoredUser, clearAuth } from "@/lib/auth-store";

type Theme = "light" | "dark" | "system";

export function UserMenu() {
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme ?? "light";
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const user = getStoredUser();
  const userDisplayName = user?.email?.split("@")[0] || "User";

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const handleLanguageToggle = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const handleProfile = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  const handleOpenSettings = () => {
    setIsOpen(false);
    setShowSettingsModal(true);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User Menu Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        title={userDisplayName || "User Menu"}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 z-50 w-64 rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {/* User Info */}
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                <span className="text-sm font-semibold">
                  {getInitials(userDisplayName)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                  {userDisplayName}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              type="button"
              onClick={handleProfile}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <User className="h-4 w-4" />
              {t.profile}
            </button>
            <button
              type="button"
              onClick={handleOpenSettings}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <Settings className="h-4 w-4" />
              {t.settings}
            </button>
            <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              {t.logout}
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSettingsModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[101] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {t.settings}
              </h2>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Settings Content */}
            <div className="space-y-4">
              {/* Theme Setting */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {language === "vi" ? "Giao diện" : "Theme"}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {theme === "light"
                          ? language === "vi"
                            ? "Sáng"
                            : "Light"
                          : language === "vi"
                            ? "Tối"
                            : "Dark"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
                    className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                      theme === "dark"
                        ? "bg-emerald-500"
                        : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                        theme === "dark" ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Language Setting */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {language === "vi" ? "Ngôn ngữ" : "Language"}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {language === "vi" ? "Tiếng Việt" : "English"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLanguageToggle}
                    className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
                  >
                    {language === "vi" ? "VI" : "EN"}
                  </button>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="mt-6 w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              {language === "vi" ? "Xong" : "Done"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
