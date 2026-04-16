"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { getMySubscription, type MySubscriptionResponse } from "@/lib/api/subscription";
import {
  SIDEBAR_SUBSCRIPTION_CACHE_TTL_MS,
  TENANT_SUBSCRIPTION_UPDATED_EVENT,
  readSidebarSubscriptionCache,
  writeSidebarSubscriptionCache,
  type TenantSubscriptionUpdatedDetail,
} from "@/lib/subscription-sync";
import { getStoredUser } from "@/lib/auth-store";

interface TenantAdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function TenantAdminSidebar({ open, setOpen }: TenantAdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [bootState] = useState(() => {
    const tenantId = getStoredUser()?.tenantId ?? null;
    const cache = readSidebarSubscriptionCache(tenantId);
    return { tenantId, cache };
  });
  const tenantId = bootState.tenantId;
  const initialSubscriptionCache = bootState.cache;
  const [subscription, setSubscription] = useState<MySubscriptionResponse | null>(
    () => initialSubscriptionCache?.data ?? null
  );
  const [subscriptionLoading, setSubscriptionLoading] = useState(
    () => !initialSubscriptionCache
  );
  
  const navigation = [
    { name: t.dashboard, href: "/tenant-admin", icon: LayoutDashboard },
    { name: t.employees, href: "/tenant-admin/employees", icon: Users },
    { name: t.departments, href: "/tenant-admin/departments", icon: Building },
    { name: t.roles, href: "/tenant-admin/roles", icon: Shield },
    { name: t.documents, href: "/tenant-admin/documents", icon: FileText },
    { name: "AI Chatbot", href: "/chatbot", icon: Bot },
    { name: t.analytics, href: "/tenant-admin/analytics", icon: BarChart3 },
    { name: t.subscription, href: "/tenant-admin/subscription", icon: CreditCard },
  ];

  useEffect(() => {
    let mounted = true;
    const cacheIsFresh =
      !!initialSubscriptionCache &&
      Date.now() - initialSubscriptionCache.fetchedAt <=
        SIDEBAR_SUBSCRIPTION_CACHE_TTL_MS;

    if (cacheIsFresh) {
      return () => {
        mounted = false;
      };
    }

    getMySubscription()
      .then((data) => {
        if (!mounted) return;
        setSubscription(data);
        writeSidebarSubscriptionCache(tenantId, data);
      })
      .catch(() => {
        if (!mounted) return;
        if (!initialSubscriptionCache) {
          setSubscription(null);
          writeSidebarSubscriptionCache(tenantId, null);
        }
      })
      .finally(() => {
        if (!mounted) return;
        setSubscriptionLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [initialSubscriptionCache, tenantId]);

  useEffect(() => {
    const handleSubscriptionUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<TenantSubscriptionUpdatedDetail>;
      const detail = customEvent.detail;
      if (!detail) return;
      if (detail.tenantId !== tenantId) return;
      setSubscription(detail.subscription);
      setSubscriptionLoading(false);
    };

    window.addEventListener(
      TENANT_SUBSCRIPTION_UPDATED_EVENT,
      handleSubscriptionUpdated as EventListener
    );

    return () => {
      window.removeEventListener(
        TENANT_SUBSCRIPTION_UPDATED_EVENT,
        handleSubscriptionUpdated as EventListener
      );
    };
  }, [tenantId]);

  useEffect(() => {
    router.prefetch("/tenant-admin/documents");
  }, [router]);

  const tierVi: Record<string, string> = {
    TRIAL: "Dùng thử",
    STARTER: "Khởi đầu",
    STANDARD: "Tiêu chuẩn",
    ENTERPRISE: "Doanh nghiệp",
  };
  const tierEn: Record<string, string> = {
    TRIAL: "Trial",
    STARTER: "Starter",
    STANDARD: "Standard",
    ENTERPRISE: "Enterprise",
  };
  const tierLabel = subscription
    ? language === "en"
      ? tierEn[subscription.tier] ?? subscription.tier
      : tierVi[subscription.tier] ?? subscription.tier
    : "—";
  const usersLabel =
    subscriptionLoading || !subscription
      ? "—"
      : `${subscription.maxUsers ?? "—"}`;
  const storageLabel =
    subscriptionLoading || !subscription
      ? "—"
      : `${subscription.maxStorageGb ?? "—"} GB`;

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
          "fixed inset-y-6 left-4 z-50 w-64 shrink-0 rounded-3xl bg-white p-6 shadow-lg shadow-purple-100/60 transition-transform duration-300 dark:bg-zinc-950 dark:shadow-black/50 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Link
                href="/tenant-admin"
                onClick={() => {
                  setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-br from-purple-400 to-purple-600 text-white shadow-lg shadow-purple-500/30">
                  <Building className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {t.tenantAdmin}
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
                {t.management}
              </p>
            </div>

            <nav className="space-y-1 text-sm">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                    }}
                    onMouseEnter={() => router.prefetch(item.href)}
                    onFocus={() => router.prefetch(item.href)}
                    className={cn(
                      "relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-3.5 py-3 font-medium transition",
                      isActive
                        ? "text-white shadow-sm shadow-purple-400/60"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="tenant-sidebar-active-pill"
                        className="absolute inset-0 rounded-2xl bg-purple-500"
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

          <div className="space-y-4">
            <div className="space-y-3 rounded-2xl bg-linear-to-br from-purple-50 to-violet-50 p-4 text-xs dark:from-purple-950/30 dark:to-violet-950/30">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                  {t.currentPlan}
                </p>
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-400">
                  {subscriptionLoading ? "…" : subscription?.status ?? "—"}
                </span>
              </div>
              <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>{t.plan}</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {tierLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.usersLabel}</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {usersLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.storage}</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {storageLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
