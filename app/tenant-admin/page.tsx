import { AppHeader } from "@/components/layout/AppHeader";
import { OrganizationStats } from "@/components/tenant-admin/OrganizationStats";
import { EmployeeOverview } from "@/components/tenant-admin/EmployeeOverview";
import { DepartmentOverview } from "@/components/tenant-admin/DepartmentOverview";
import Link from "next/link";
import { Users, Building, Shield, CreditCard, FileText } from "lucide-react";

export default function TenantAdminPage() {
  const quickLinks = [
    {
      title: "Nhân viên",
      description: "Quản lý danh sách nhân viên",
      href: "/tenant-admin/employees",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Phòng ban",
      description: "Quản lý cấu trúc phòng ban",
      href: "/tenant-admin/departments",
      icon: Building,
      color: "bg-lime-500",
    },
    {
      title: "Roles & Permissions",
      description: "Quản lý quyền và vai trò",
      href: "/tenant-admin/roles",
      icon: Shield,
      color: "bg-emerald-500",
    },
    {
      title: "Subscription",
      description: "Quản lý gói & nâng cấp tổ chức",
      href: "/tenant-admin/subscription",
      icon: CreditCard,
      color: "bg-teal-500",
    },
    {
      title: "Documents",
      description: "Quản lý tài liệu, categories & tags",
      href: "/tenant-admin/documents",
      icon: FileText,
      color: "bg-sky-500",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-zinc-100 via-white to-zinc-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <AppHeader />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Organization Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Quản lý nhân viên và cấu trúc tổ chức
            </p>
          </div>

          {/* Stats */}
          <OrganizationStats />

          {/* Quick Links */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          {/* Overview Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            <EmployeeOverview />
            <DepartmentOverview />
          </div>
        </div>
      </main>
    </div>
  );
}
