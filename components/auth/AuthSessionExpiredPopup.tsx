"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, ShieldAlert } from "lucide-react";
import { clearAuth } from "@/lib/auth-store";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  type AuthSessionExpiredDetail,
} from "@/lib/auth-session-events";
import { useLanguageStore } from "@/lib/language-store";

const AUTO_REDIRECT_MS = 600;

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/") ||
    pathname.startsWith("/forgot-password/")
  );
}

export function AuthSessionExpiredPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const redirectTimeoutRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  const copy = useMemo(() => {
    if (language === "en") {
      return {
        title: "Session expired",
        description:
          "Your sign-in session is no longer valid. Please sign in again to continue.",
        cta: "Sign in again",
        technicalReason: "Technical reason",
      };
    }

    return {
      title: "Phiên đăng nhập đã hết hạn",
      description:
        "Phiên đăng nhập hiện tại không còn hợp lệ. Vui lòng đăng nhập lại để tiếp tục.",
      cta: "Đăng nhập lại",
      technicalReason: "Lý do kỹ thuật",
    };
  }, [language]);

  const clearRedirectTimeout = useCallback(() => {
    if (redirectTimeoutRef.current === null) return;
    window.clearTimeout(redirectTimeoutRef.current);
    redirectTimeoutRef.current = null;
  }, []);

  const handleSignInAgain = useCallback(() => {
    clearRedirectTimeout();
    clearAuth();
    router.replace("/login?reason=session-expired");
    router.refresh();
  }, [clearRedirectTimeout, router]);

  useEffect(() => {
    if (!pathname || isPublicPath(pathname)) {
      clearRedirectTimeout();
      const frame = window.requestAnimationFrame(() => {
        setMounted(false);
        setVisible(false);
        setReason(null);
      });
      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    if (typeof window === "undefined") {
      return;
    }

    const onSessionExpired = (event: Event) => {
      const customEvent = event as CustomEvent<AuthSessionExpiredDetail>;
      const detail = customEvent.detail;

      setReason(detail?.message ?? null);
      setMounted(true);
      window.requestAnimationFrame(() => {
        setVisible(true);
      });

      clearRedirectTimeout();
      redirectTimeoutRef.current = window.setTimeout(() => {
        handleSignInAgain();
      }, AUTO_REDIRECT_MS);
    };

    window.addEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      onSessionExpired as EventListener
    );

    return () => {
      clearRedirectTimeout();
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        onSessionExpired as EventListener
      );
    };
  }, [pathname, clearRedirectTimeout, handleSignInAgain]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[140] flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="presentation"
    >
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-[2px] dark:bg-black/75" />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_28px_72px_rgba(15,23,42,0.32)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/60 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.97] opacity-0"
        }`}
      >
        <div className="bg-linear-to-r from-emerald-50 via-white to-cyan-50 px-6 py-5 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2
            id="session-expired-title"
            className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {copy.description}
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          {reason && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200">
              <span className="font-semibold">{copy.technicalReason}:</span> {reason}
            </div>
          )}

          <button
            type="button"
            onClick={handleSignInAgain}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            <LogIn className="h-4 w-4" />
            {copy.cta}
          </button>
        </div>
      </section>
    </div>
  );
}