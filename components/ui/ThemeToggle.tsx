"use client";

import { Moon, Sun } from "lucide-react";
import { useAppTheme } from "@/lib/use-app-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:h-10 sm:w-10 sm:rounded-xl"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
      ) : (
        <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
      )}
    </button>
  );
}
