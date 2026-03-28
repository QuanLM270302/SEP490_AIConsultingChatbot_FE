"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface AuthHomePlainLinkProps {
  href?: string;
  /** Thêm vào wrapper (vd. đăng ký: `mb-8 pt-0`) */
  className?: string;
  /**
   * `plain` — link chữ (đăng ký).
   * `bar` — dòng «hoặc» + nút ngang full width giống kích thước nút Login (đăng nhập).
   */
  variant?: "plain" | "bar";
}

/** Liên kết về trang chủ: dạng chữ hoặc thanh nút full width. */
export function AuthHomePlainLink({
  href = "/",
  className = "",
  variant = "plain",
}: AuthHomePlainLinkProps) {
  const { language } = useLanguageStore();
  const t = translations[language];

  if (variant === "bar") {
    return (
      <div className="w-full pt-1">
        <div
          className="flex items-center gap-3 py-4"
          role="separator"
          aria-label={t.or}
        >
          <div
            className="h-px flex-1 bg-zinc-200 dark:bg-zinc-600"
            aria-hidden
          />
          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            {t.or}
          </span>
          <div
            className="h-px flex-1 bg-zinc-200 dark:bg-zinc-600"
            aria-hidden
          />
        </div>
        <Link
          href={href}
          className="flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-emerald-400/50 hover:bg-emerald-50/90 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-100 dark:hover:border-emerald-500/40 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-100"
        >
          {t.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div className={twMerge("pt-4 text-center", className)}>
      <Link
        href={href}
        className="text-sm font-medium text-zinc-500 underline-offset-4 transition hover:text-emerald-600 hover:underline dark:text-zinc-400 dark:hover:text-emerald-400"
      >
        {t.backToHome}
      </Link>
    </div>
  );
}
