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
  const [theme, setThemeState] = useState<ThemeMode>("light");

  useLayoutEffect(() => {
    const t = resolveTheme();
    setThemeState(t);
    applyTheme(t);
  }, []);

  useEffect(() => {
    return onThemeChange((next) => {
      setThemeState(next);
    });
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    persistTheme(mode);
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === "dark" ? "light" : "dark";
      persistTheme(next);
      return next;
    });
  }, []);

  return { theme, setTheme, toggleTheme };
}
