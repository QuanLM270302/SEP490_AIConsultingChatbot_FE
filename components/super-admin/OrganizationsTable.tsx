"use client";

import { MoreVertical } from "lucide-react";

const organizations = [
  { id: 1, name: "Công ty TNHH ABC", users: 45, status: "active", plan: "Enterprise", createdAt: "2024-01-15" },
  { id: 2, name: "Tập đoàn XYZ", users: 120, status: "active", plan: "Enterprise", createdAt: "2024-02-01" },
  { id: 3, name: "Công ty DEF", users: 28, status: "active", plan: "Business", createdAt: "2024-02-10" },
  { id: 4, name: "Startup GHI", users: 12, status: "trial", plan: "Trial", createdAt: "2024-02-28" },
];

export function OrganizationsTable() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Tổ chức
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Người dùng
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Gói
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Ngày tạo
              </th>
              <th className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {organizations.map((org) => (
              <tr key={org.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">
                    {org.name}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-zinc-900 dark:text-white">{org.users}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      org.status === "active"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {org.status === "active" ? "Hoạt động" : "Dùng thử"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                  {org.plan}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                  {org.createdAt}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-900">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
