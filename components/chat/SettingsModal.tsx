"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Globe, X } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { useAppTheme } from "@/lib/use-app-theme";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal bringing together app-wide preferences that used to live scattered around
 * the sidebar rail (theme toggle) and other menus (language). One dialog keeps those
 * controls discoverable without cluttering the persistent navigation.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useAppTheme();
  const isDark = theme === "dark";
  const isEn = language === "en";
  const [visible, setVisible] = useState(false);
  const t = isEn
    ? {
        title: "Settings",
        closeSettings: "Close settings",
        close: "Close",
        themeTitle: "Theme",
        themeDescription: "Choose the appearance for your workspace.",
        light: "Light",
        dark: "Dark",
        languageTitle: "Language",
        languageDescription: "Select the display language.",
        vietnamese: "Vietnamese",
        english: "English",
        done: "Done",
      }
    : {
        title: "Cài đặt",
        closeSettings: "Đóng cài đặt",
        close: "Đóng",
        themeTitle: "Giao diện",
        themeDescription: "Chọn chế độ hiển thị cho không gian làm việc.",
        light: "Sáng",
        dark: "Tối",
        languageTitle: "Ngôn ngữ",
        languageDescription: "Chọn ngôn ngữ hiển thị.",
        vietnamese: "Tiếng Việt",
        english: "English",
        done: "Xong",
      };

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const itemBase = `flex items-center justify-between rounded-2xl border px-4 py-4 transition-colors ${
    isDark
      ? "border-zinc-700/70 bg-zinc-900/70 hover:border-zinc-600"
      : "border-zinc-200 bg-white hover:border-zinc-300"
  }`;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className={`absolute inset-0 backdrop-blur-[2px] ${isDark ? "bg-black/70" : "bg-zinc-900/45"}`} />
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t.closeSettings}
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-[30rem] overflow-hidden rounded-3xl border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark
            ? "border-zinc-800 bg-zinc-950 shadow-[0_28px_72px_rgba(0,0,0,0.6)]"
            : "border-zinc-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.22)]"
        } ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.97] opacity-0"
        }`}
      >
        <div className={`flex items-center justify-between border-b px-6 py-5 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
          <h2 id="settings-modal-title" className={`text-3xl font-bold ${isDark ? "text-zinc-50" : "text-zinc-900"}`}>
            {t.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-1.5 transition-colors ${
              isDark
                ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
            }`}
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <section className={itemBase}>
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </div>
              <div>
                <p className={`text-[1.05rem] font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{t.themeTitle}</p>
                <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{theme === "dark" ? t.dark : t.light}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                theme === "dark" ? "bg-emerald-500" : "bg-zinc-400"
              }`}
              aria-label={t.themeTitle}
              aria-pressed={theme === "dark"}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </section>

          <section className={itemBase}>
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-600"}`}>
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-[1.05rem] font-semibold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>{t.languageTitle}</p>
                <p className={`text-sm ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>{language === "en" ? t.english : t.vietnamese}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "vi" : "en")}
              className="min-w-11 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-emerald-400"
              aria-label={t.languageTitle}
            >
              {language === "en" ? "EN" : "VI"}
            </button>
          </section>
        </div>

        <div className={`border-t px-6 py-4 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-emerald-500 px-5 py-3 text-lg font-semibold text-white transition hover:bg-emerald-400"
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
}
