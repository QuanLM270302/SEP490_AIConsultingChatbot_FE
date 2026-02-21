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
  DollarSign,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Organizations", href: "/super-admin/organizations", icon: Building2 },
  { name: "Onboarding", href: "/super-admin/onboarding", icon: UserCheck },
  { name: "System Health", href: "/super-admin/system", icon: Activity },
  { name: "Compliance", href: "/super-admin/compliance", icon: Shield },
  { name: "Reports", href: "/super-admin/reports", icon: BarChart3 },
  { name: "Pricing", href: "/super-admin/pricing", icon: DollarSign },
];

interface SuperAdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SuperAdminSidebar({ open, setOpen }: SuperAdminSidebarProps) {
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
      <aside
        className={cn(
          "fixed inset-y-6 left-4 z-50 w-64 shrink-0 rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 transition-transform duration-300 dark:bg-zinc-950 dark:shadow-black/50 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <Link href="/super-admin" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-500 text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Super Admin
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5 text-zinc-500" />
              </button>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Platform Menu
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

            {/* System Status */}
            <div className="space-y-3 rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  System Status
                </p>
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-lime-400" />
                  Healthy
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <span>99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Active Orgs</span>
                  <span>24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Users</span>
                  <span>1,234</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back to home */}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
          >
            ← Back to Home
          </Link>
        </div>
      </aside>
    </>
  );
}
