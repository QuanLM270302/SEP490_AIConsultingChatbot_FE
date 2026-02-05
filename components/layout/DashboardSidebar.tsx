"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Building2,
  UserCheck,
  Activity,
  Shield,
  BarChart3,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Tổ chức", href: "/admin/organizations", icon: Building2 },
  { name: "Onboarding", href: "/admin/onboarding", icon: UserCheck },
  { name: "System Health", href: "/admin/system", icon: Activity },
  { name: "Compliance", href: "/admin/compliance", icon: Shield },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
];

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/80 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-72 flex-col transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-white px-6 pb-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">Admin</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6 text-zinc-500" />
            </button>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors",
                            isActive
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                              : "text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-6 w-6 shrink-0",
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              
              <li className="mt-auto">
                <Link
                  href="/"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-700 hover:bg-zinc-50 hover:text-blue-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  ← Về trang chủ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
