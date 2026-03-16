"use client";

import Link from "next/link";
import { UserPlus, Building2, FileUp, BarChart3 } from "lucide-react";

const actions = [
  {
    name: "Add Employee",
    description: "Thêm nhân viên mới",
    icon: UserPlus,
    href: "/tenant-admin/employees",
    color: "blue",
  },
  {
    name: "Create Department",
    description: "Tạo phòng ban mới",
    icon: Building2,
    href: "/tenant-admin/departments",
    color: "green",
  },
  {
    name: "Upload Document",
    description: "Thêm tài liệu mới",
    icon: FileUp,
    href: "/tenant-admin/documents",
    color: "purple",
  },
  {
    name: "View Analytics",
    description: "Xem báo cáo chi tiết",
    icon: BarChart3,
    href: "/tenant-admin/analytics",
    color: "orange",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <h3 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
        Quick Actions
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.href}
              className="group flex items-start gap-4 rounded-2xl bg-zinc-50 p-4 transition hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110 ${
                  action.color === "blue"
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : action.color === "green"
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : action.color === "purple"
                    ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                    : "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-zinc-900 dark:text-white">
                  {action.name}
                </h4>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
