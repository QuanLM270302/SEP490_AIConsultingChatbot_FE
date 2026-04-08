export type ThemeMode = "light" | "dark";

const THEME_KEY = "theme";
const THEME_CHANGE_EVENT = "app-theme-change";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getSavedTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  const savedTheme = localStorage.getItem(THEME_KEY);
  return isThemeMode(savedTheme) ? savedTheme : null;
}

export function resolveTheme(): ThemeMode {
  return getSavedTheme() ?? getSystemTheme();
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
}

export function setTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_CHANGE_EVENT, { detail: theme }));
}

export function toggleTheme(theme: ThemeMode): ThemeMode {
  const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  return nextTheme;
}

export function onThemeChange(callback: (theme: ThemeMode) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_KEY) return;
    const value = isThemeMode(event.newValue) ? event.newValue : getSystemTheme();
    callback(value);
  };

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<ThemeMode>;
    if (!customEvent.detail) return;
    callback(customEvent.detail);
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, handleCustomEvent);
  };
}
