"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { logout } from "@/lib/api/auth";
import { getAccessToken, clearAuth } from "@/lib/auth-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface LogoutButtonProps {
  /** Optional class for the label (e.g. hide in collapsed sidebar, show on hover) */
  labelClassName?: string;
}

export function LogoutButton({ labelClassName }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  const handleLogout = async () => {
    const token = getAccessToken();
    setLoading(true);
    try {
      if (token) await logout(token);
    } finally {
      clearAuth();
      router.push("/login");
      router.refresh();
    }
    setLoading(false);
  };

  const label = loading ? (language === "en" ? "Signing out..." : "Đang đăng xuất...") : t.logout;

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex w-full min-w-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-60 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
      </span>
      {labelClassName ? (
        <span className={labelClassName}>{label}</span>
      ) : (
        label
      )}
    </button>
  );
}
