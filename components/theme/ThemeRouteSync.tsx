"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { applyTheme, resolveTheme } from "@/lib/theme";

/**
 * Re-apply saved theme on every client navigation so no route can leave <html> out of sync.
 */
export function ThemeRouteSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    applyTheme(resolveTheme());
  }, [pathname]);

  return null;
}
