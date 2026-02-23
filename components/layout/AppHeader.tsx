"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getStoredUser } from "@/lib/auth-store";
import { roleToPath, hasAllowedRole } from "@/lib/auth-routes";

const ROLE_EMPLOYEE = "ROLE_EMPLOYEE";
const ROLE_TENANT_ADMIN = "ROLE_TENANT_ADMIN";
const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
const ROLE_CONTENT_MANAGER = "ROLE_CONTENT_MANAGER";

const navLinks = [
  { href: "/employee", label: "Employee", roles: [ROLE_EMPLOYEE] },
  { href: "/tenant-admin", label: "Tenant Admin", roles: [ROLE_TENANT_ADMIN] },
  { href: "/super-admin", label: "Super Admin", roles: [ROLE_SUPER_ADMIN] },
  { href: "/content-manager", label: "Content Manager", roles: [ROLE_CONTENT_MANAGER] },
];

export function AppHeader() {
  const pathname = usePathname();
  const user = getStoredUser();
  const roles = user?.roles ?? [];
  const allowedLinks = navLinks.filter((link) => hasAllowedRole(roles, link.roles));
  const homeHref = roles.length ? roleToPath(roles) : "/employee";

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
      <div className="flex items-center gap-8">
        <Link
          href={homeHref}
          className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500" />
          <span className="hidden sm:inline">Internal Consultant AI</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {allowedLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
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
