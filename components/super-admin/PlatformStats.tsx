"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  CreditCard,
} from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { getStoredUser } from "@/lib/auth-store";
import {
  fetchPlatformDashboard,
  parsePlatformDashboardJson,
  type ParsedPlatformDashboard,
} from "@/lib/api/platform-dashboard";

type StatItem = {
  name: string;
  value: string;
  icon: typeof Building2;
};

const EMPTY_PARSED: ParsedPlatformDashboard = {
  systemStatus: "Unknown",
  systemStatusLabelRaw: "",
  tenants: { total: 0, active: 0, pending: 0, suspended: 0, activePercentage: 0 },
  adminPlatformUsers: 0,
  adminDocumentsTotal: 0,
  adminLlmQueriesTotal: 0,
  staffSubscriptionsTotal: 0,
  staffTotalDocuments: 0,
};

export function PlatformStats() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [parsed, setParsed] = useState<ParsedPlatformDashboard>(EMPTY_PARSED);
  const [loading, setLoading] = useState(true);

  const roles = getStoredUser()?.roles ?? [];
  const isStaff = roles.some((role) => role.includes("STAFF"));

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const r = getStoredUser()?.roles ?? [];
      const staff = r.some((role) => role.includes("STAFF"));
      setLoading(true);
      const { ok, data } = await fetchPlatformDashboard(staff);
      if (cancelled) return;
      if (!ok) {
        setParsed(EMPTY_PARSED);
        setLoading(false);
        return;
      }
      setParsed(parsePlatformDashboardJson(staff, data));
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const format = (n: number) =>
    loading ? "—" : Number.isFinite(n) ? n.toLocaleString() : "—";

  const adminStats: StatItem[] = [
    {
      name: t.dashboardTotalTenants,
      value: format(parsed.tenants.total),
      icon: Building2,
    },
    {
      name: t.dashboardActiveTenants,
      value: format(parsed.tenants.active),
      icon: CheckCircle,
    },
    {
      name: t.dashboardSuspendedTenants,
      value: format(parsed.tenants.suspended),
      icon: XCircle,
    },
    {
      name: t.platformTotalUsers,
      value: format(parsed.adminPlatformUsers),
      icon: Users,
    },
    {
      name: t.dashboardDocuments,
      value: format(parsed.adminDocumentsTotal),
      icon: FileText,
    },
    {
      name: t.dashboardAiQueries,
      value: format(parsed.adminLlmQueriesTotal),
      icon: MessageSquare,
    },
  ];

  const staffStats: StatItem[] = [
    {
      name: t.dashboardTotalTenants,
      value: format(parsed.tenants.total),
      icon: Building2,
    },
    {
      name: t.dashboardActiveTenants,
      value: format(parsed.tenants.active),
      icon: CheckCircle,
    },
    {
      name: t.dashboardPendingTenants,
      value: format(parsed.tenants.pending),
      icon: Clock,
    },
    {
      name: t.dashboardSuspendedTenants,
      value: format(parsed.tenants.suspended),
      icon: XCircle,
    },
    {
      name: t.dashboardSubscriptions,
      value: format(parsed.staffSubscriptionsTotal),
      icon: CreditCard,
    },
    {
      name: t.dashboardDocuments,
      value: format(parsed.staffTotalDocuments),
      icon: FileText,
    },
  ];

  const stats = isStaff ? staffStats : adminStats;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="rounded-3xl bg-white p-5 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-400 truncate" title={stat.name}>
                {stat.name}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50 tabular-nums">
                {stat.value}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
              <stat.icon className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
