"use client";

import Link from "next/link";
import { Cog6ToothIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { getStoredUser } from "@/lib/auth-store";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function DashboardAccountSection() {
  const user = getStoredUser();
  const isLoggedIn = !!user?.roles?.length;

  return (
    <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
        Account
      </p>
      <div className="mt-2 space-y-1">
        {isLoggedIn ? (
          <div className="max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-200 group-hover/nav:max-h-40 group-hover/nav:opacity-100 space-y-1">
            <Link
              href="/profile"
              className="flex w-full min-w-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900">
                <Cog6ToothIcon className="h-4 w-4" />
              </span>
              <span>Profile</span>
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="flex w-full min-w-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
              <ArrowLeftOnRectangleIcon className="h-4 w-4" />
            </span>
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
