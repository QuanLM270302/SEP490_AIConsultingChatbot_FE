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
  const [theme, setThemeState] = useState<ThemeMode>(() => resolveTheme());

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

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
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    persistTheme(next);
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
