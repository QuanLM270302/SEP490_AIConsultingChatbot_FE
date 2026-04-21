"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  applyTheme,
  onThemeChange,
  resolveTheme,
  setTheme as persistTheme,
  type ThemeMode,
} from "@/lib/theme";

/**
 * Single source for UI theme state + localStorage + <html class="light|dark">.
 * useLayoutEffect avoids the flash where a mounted header strips .dark before reading storage.
 */
export function useAppTheme() {
  // Keep first server/client render deterministic to prevent hydration mismatches.
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const resolvedTheme = resolveTheme();
    setThemeState(resolvedTheme);
    applyTheme(resolvedTheme);
    setHydrated(true);
  }, []);

  useLayoutEffect(() => {
    if (!hydrated) return;
    applyTheme(theme);
  }, [theme, hydrated]);

  useEffect(() => {
    return onThemeChange((next) => {
      setThemeState(next);
    });
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    persistTheme(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = hydrated ? theme : resolveTheme();
    const next: ThemeMode = currentTheme === "dark" ? "light" : "dark";
    setThemeState(next);
    persistTheme(next);
  }, [hydrated, theme]);

  return { theme, setTheme, toggleTheme, hydrated };
}
