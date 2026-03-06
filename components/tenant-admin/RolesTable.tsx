"use client";

import { MoreVertical } from "lucide-react";

const roles = [
  { id: 1, name: "Admin", users: 5, permissions: 25 },
  { id: 2, name: "Manager", users: 12, permissions: 18 },
  { id: 3, name: "Employee", users: 139, permissions: 8 },
];

export function RolesTable() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Role</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Users</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Permissions</th>
              <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {roles.map((role) => (
              <tr key={role.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{role.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">{role.users}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">{role.permissions}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
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
