"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { LogoutButton } from "@/components/auth/LogoutButton";

const navLinks = [
  { href: "/employee", label: "Employee" },
  { href: "/tenant-admin", label: "Tenant Admin" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <div className="flex items-center gap-8">
        <Link
          href="/employee"
          className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500" />
          <span className="hidden sm:inline">Internal Consultant AI</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === href
                  ? "bg-green-500 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <UserCircleIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Profile</span>
        </Link>
        <div className="[&_button]:w-auto! [&_button]:rounded-lg! [&_button]:px-3! [&_button]:py-2!">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
