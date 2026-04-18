"use client";

import { useEffect, useState } from "react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { OrganizationStats } from "@/components/tenant-admin/OrganizationStats";
import { AIUsageChart } from "@/components/tenant-admin/AIUsageChart";
import { EmployeeOverview } from "@/components/tenant-admin/EmployeeOverview";
import { DepartmentOverview } from "@/components/tenant-admin/DepartmentOverview";
import Link from "next/link";
import { Users, Building, Shield, CreditCard, FileText, Bot } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import { getTenantLlmUsage, type TenantLlmUsageResponse } from "@/lib/api/tenant-admin";
import { isAuthExpiredErrorMessage } from "@/lib/auth-session-events";

export default function TenantAdminPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [llmUsage, setLlmUsage] = useState<TenantLlmUsageResponse | null>(null);
  const [llmLoading, setLlmLoading] = useState(true);
  const [llmError, setLlmError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTenantLlmUsage()
      .then((data) => {
        if (cancelled) return;
        setLlmUsage(data);
      })
      .catch((e) => {
        if (cancelled) return;
        setLlmUsage(null);
        const message = e instanceof Error ? e.message : "Failed to load AI usage";
        setLlmError(isAuthExpiredErrorMessage(message) ? null : message);
      })
      .finally(() => {
        if (!cancelled) setLlmLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const quickLinks = [
    {
      title: t.employeesLabel,
      description: t.employeesDescription,
      href: "/tenant-admin/employees",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: t.departmentsLabel,
      description: t.departmentsDescription,
      href: "/tenant-admin/departments",
      icon: Building,
      color: "bg-lime-500",
    },
    {
      title: t.rolesPermissions,
      description: t.rolesPermissionsDescription,
      href: "/tenant-admin/roles",
      icon: Shield,
      color: "bg-emerald-500",
    },
    {
      title: t.subscriptionLabel,
      description: t.subscriptionDescription,
      href: "/tenant-admin/subscription",
      icon: CreditCard,
      color: "bg-teal-500",
    },
    {
      title: t.documentsLabel,
      description: t.documentsDescription,
      href: "/tenant-admin/documents",
      icon: FileText,
      color: "bg-sky-500",
    },
    {
      title: t.aiChatbot,
      description: t.aiChatbotDescription,
      href: "/chatbot",
      icon: Bot,
      color: "bg-violet-500",
    },
  ];

  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {t.organizationDashboard}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            {t.manageEmployeesStructure}
          </p>
        </div>

        {/* Charts: organization KPIs */}
        <OrganizationStats />

        {/* Charts: people & departments */}
        <div className="grid gap-6 lg:grid-cols-2">
          <EmployeeOverview />
          <DepartmentOverview />
        </div>

        {/* AI usage */}
        <AIUsageChart data={llmUsage} loading={llmLoading} error={llmError} />

        {/* Quick Links (kept as cards, not charts) */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
            {t.quickActions}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-3xl bg-white p-6 shadow-lg shadow-green-100/60 transition hover:shadow-xl hover:shadow-green-200/60 dark:bg-zinc-950 dark:shadow-black/40 dark:hover:shadow-black/60"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${link.color} text-white`}>
                    <link.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-900 group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                      {link.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </TenantAdminLayout>
  );
}
