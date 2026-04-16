"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  X,
  UserCog,
  Package,
  GraduationCap,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { StaffPortalCard } from "@/components/staff/StaffPortalCard";

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
    { name: "Onboarding", href: "/staff/onboarding", icon: GraduationCap },
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
          "fixed inset-y-6 left-4 z-50 w-64 shrink-0 rounded-3xl bg-white p-6 shadow-lg shadow-blue-100/60 transition-transform duration-300 dark:bg-zinc-950 dark:shadow-black/50 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <Link href="/staff" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30">
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

            {/* Section Label */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {t.management}
              </p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 text-sm">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-3.5 py-3 font-medium transition",
                      isActive
                        ? "text-white shadow-sm shadow-blue-400/60"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="staff-sidebar-active-pill"
                        className="absolute inset-0 rounded-2xl bg-blue-500"
                        transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.9 }}
                      />
                    ) : null}
                    <span className="relative z-10 flex items-center gap-3">
                      <span className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-2xl text-sm",
                        isActive ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-900"
                      )}>
                        <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-zinc-500")} />
                      </span>
                      {item.name}
                    </span>
                    {isActive && <span className="relative z-10 h-8 w-1.5 rounded-full bg-white/70" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Info Section — state lives in StaffPortalCard; layout keeps it mounted across /staff/* */}
          <div className="space-y-4">
            <StaffPortalCard />
          </div>
        </div>
      </aside>
    </>
  );
}
