"use client";

import Link from "next/link";
import { ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { getStoredUser } from "@/lib/auth-store";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function DashboardTopBar() {
  const user = getStoredUser();
  const isLoggedIn = !!user?.roles?.length;

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 min-w-0 items-center justify-between border-b border-zinc-200/80 bg-white/95 px-3 backdrop-blur sm:px-6 dark:border-zinc-800 dark:bg-zinc-950/95">
      <Link
        href="/"
        className="flex min-w-0 items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50"
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />
        <span className="hidden truncate sm:inline">General Dashboard</span>
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {isLoggedIn ? (
          <>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 sm:gap-2 sm:px-3 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <div className="[&_button]:w-auto! [&_button]:rounded-lg! [&_button]:px-2.5! [&_button]:py-1.5! sm:[&_button]:px-3!">
              <LogoutButton labelClassName="hidden sm:inline" />
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-green-500/60 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-500 hover:text-white sm:px-4 sm:py-2 sm:text-sm dark:border-green-400/50 dark:bg-green-500/10 dark:text-green-300 dark:hover:bg-green-500 dark:hover:text-white"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
