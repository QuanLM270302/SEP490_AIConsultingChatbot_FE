"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface AuthHomePlainLinkProps {
  href?: string;
  /** Thêm vào wrapper (vd. `mb-8`) */
  className?: string;
  /**
   * `plain` — link chữ + mũi tên, căn trái (đăng ký, quên mật khẩu).
   * `bar` — dòng «hoặc» + nút ngang full width giống kích thước nút Login (đăng nhập).
   */
  variant?: "plain" | "bar";
  forceEnglish?: boolean;
}

const BackArrowIcon = () => (
  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

/** Liên kết về trang chủ: dạng chữ + mũi tên hoặc thanh nút full width. */
export function AuthHomePlainLink({
  href = "/",
  className = "",
  variant = "plain",
  forceEnglish = false,
}: AuthHomePlainLinkProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const orLabel = forceEnglish ? "OR" : t.or;
  const backToHomeLabel = forceEnglish ? "Back to home page" : t.backToHome;

  if (variant === "bar") {
    return (
      <div className="w-full pt-1">
        <div
          className="flex items-center gap-3 py-4"
          role="separator"
          aria-label={orLabel}
        >
          <div
            className="h-px flex-1 bg-zinc-200 dark:bg-zinc-600"
            aria-hidden
          />
          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            {orLabel}
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
          {backToHomeLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className={twMerge("w-full text-left", className)}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <BackArrowIcon />
        {backToHomeLabel}
      </Link>
    </div>
  );
}
