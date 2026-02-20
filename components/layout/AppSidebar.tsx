"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircleIcon, HomeIcon } from "@heroicons/react/24/outline";
import { LogoutButton } from "@/components/auth/LogoutButton";

export interface AppSidebarLink {
  href: string;
  label: string;
}

interface AppSidebarProps {
  /** Optional nav links (e.g. Overview, Employee home) */
  links?: AppSidebarLink[];
}

const labelClass = "whitespace-nowrap overflow-hidden opacity-0 transition-opacity duration-200 lg:group-hover:opacity-100";

export function AppSidebar({ links = [] }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="group hidden w-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-md transition-[width] duration-200 ease-out hover:w-56 dark:bg-zinc-950 lg:flex lg:flex-col">
      <div className="flex min-w-0 flex-1 flex-col p-3">
        <div className="group/nav flex flex-col">
          <nav className="flex flex-col gap-1 text-sm">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                  pathname === href
                    ? "bg-green-500 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }`}
              >
                <HomeIcon className="h-5 w-5 shrink-0" />
                <span className={labelClass}>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-200 group-hover/nav:max-h-40 group-hover/nav:opacity-100 mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800 space-y-1">
            <Link
              href="/profile"
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition ${
                pathname === "/profile"
                  ? "bg-green-500 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              }`}
            >
              <UserCircleIcon className="h-5 w-5 shrink-0" />
              <span className={labelClass}>Profile</span>
            </Link>
            <LogoutButton labelClassName={labelClass} />
          </div>
        </div>
      </div>
    </aside>
  );
}
