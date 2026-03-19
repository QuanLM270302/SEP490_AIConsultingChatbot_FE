"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Users,
  Building,
  Shield,
  Bot,
  FileText,
  BarChart3,
  CreditCard,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/tenant-admin", icon: LayoutDashboard },
  { name: "Employees", href: "/tenant-admin/employees", icon: Users },
  { name: "Departments", href: "/tenant-admin/departments", icon: Building },
  { name: "Roles & Permissions", href: "/tenant-admin/roles", icon: Shield },
  { name: "Documents", href: "/tenant-admin/documents", icon: FileText },
  { name: "AI Chatbot", href: "/chatbot", icon: Bot },
  { name: "AI Analytics", href: "/tenant-admin/analytics", icon: BarChart3 },
  { name: "Subscription", href: "/tenant-admin/subscription", icon: CreditCard },
];

interface TenantAdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function TenantAdminSidebar({ open, setOpen }: TenantAdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-zinc-900/80 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-6 left-4 z-50 w-64 shrink-0 rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 transition-transform duration-300 dark:bg-zinc-950 dark:shadow-black/50 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/tenant-admin" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30">
                  <Building className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Tenant Admin
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Management
              </p>
            </div>

            <nav className="space-y-1 text-sm">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3.5 py-3 font-medium transition",
                      isActive
                        ? "bg-green-500 text-white shadow-sm shadow-green-400/60"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-2xl text-sm",
                        isActive ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-900"
                      )}>
                        <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-zinc-500")} />
                      </span>
                      {item.name}
                    </span>
                    {isActive && <span className="h-8 w-1.5 rounded-full bg-white/70" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl bg-linear-to-br from-green-50 to-emerald-50 p-4 text-xs dark:from-green-950/30 dark:to-emerald-950/30">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  Current Plan
                </p>
                <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
                  —
                </span>
              </div>
              <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>Users</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">—</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">—</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
            >
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
