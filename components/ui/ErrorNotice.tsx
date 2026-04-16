"use client";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { parseApiErrorMessage } from "@/lib/api/parseApiError";
import { useLanguageStore } from "@/lib/language-store";

interface ErrorNoticeProps {
  message: string;
  title?: string;
  className?: string;
  children?: ReactNode;
}

export function ErrorNotice({ message, title, className, children }: ErrorNoticeProps) {
  const { language } = useLanguageStore();
  const finalTitle =
    title ??
    (language === "en" ? "Something went wrong" : "Đã xảy ra lỗi");

  return (
    <div
      role="alert"
      className={`rounded-2xl border border-red-200 bg-linear-to-br from-red-50 to-rose-50 p-4 shadow-sm shadow-red-100/70 dark:border-red-900/60 dark:from-red-950/35 dark:to-rose-950/35 dark:shadow-black/20 ${
        className ?? ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-300">
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-red-900 dark:text-red-100">
            {finalTitle}
          </p>
          <p className="text-sm leading-relaxed text-red-700 dark:text-red-200">
            {parseApiErrorMessage(message)}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}