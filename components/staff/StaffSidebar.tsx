"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  X,
  UserCog,
  Package,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

interface StaffSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function StaffSidebar({ open, setOpen }: StaffSidebarProps) {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const navigation = [
    { name: t.dashboard, href: "/staff", icon: LayoutDashboard },
    { name: t.organizations, href: "/staff/organizations", icon: Building2 },
    { name: "Subscriptions", href: "/staff/subscriptions", icon: Package },
    { name: "Transactions", href: "/staff/transactions", icon: CreditCard },
  ];

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
              <Link href="/staff" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500 text-white">
                  <UserCog className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Staff
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
                Menu
              </p>
            </div>

            <nav className="space-y-1 text-sm">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 font-medium transition",
                      isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
