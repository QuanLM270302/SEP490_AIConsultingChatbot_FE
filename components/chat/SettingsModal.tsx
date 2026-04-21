"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Globe, X, Palette } from "lucide-react";
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
  const isEn = language === "en";
  const [visible, setVisible] = useState(false);

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

  const sectionTitle = "text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400";
  const optionBase =
    "flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200";
  const activeOption =
    "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]";
  const idleOption =
    "border-zinc-700 bg-zinc-900/70 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/80";

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px] dark:bg-black/75" />
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={isEn ? "Close settings" : "Đóng cài đặt"}
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-[28rem] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-[0_28px_72px_rgba(0,0,0,0.6)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.97] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <h2 id="settings-modal-title" className="text-2xl font-bold text-zinc-50">
            {isEn ? "Settings" : "Cài đặt"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            aria-label={isEn ? "Close" : "Đóng"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-7 px-6 py-6">
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-zinc-400" />
              <h3 className={sectionTitle}>{isEn ? "Theme" : "Giao diện"}</h3>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`${optionBase} ${theme === "light" ? activeOption : idleOption}`}
                aria-pressed={theme === "light"}
              >
                <Sun className="h-4 w-4" />
                {isEn ? "Light" : "Sáng"}
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`${optionBase} ${theme === "dark" ? activeOption : idleOption}`}
                aria-pressed={theme === "dark"}
              >
                <Moon className="h-4 w-4" />
                {isEn ? "Dark" : "Tối"}
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-zinc-400" />
              <h3 className={sectionTitle}>{isEn ? "Language" : "Ngôn ngữ"}</h3>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={`${optionBase} ${language === "vi" ? activeOption : idleOption}`}
                aria-pressed={language === "vi"}
              >
                Tiếng Việt
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`${optionBase} ${language === "en" ? activeOption : idleOption}`}
                aria-pressed={language === "en"}
              >
                English
              </button>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-800 bg-zinc-900/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            {isEn ? "Done" : "Xong"}
          </button>
        </div>
      </div>
    </div>
  );
}
