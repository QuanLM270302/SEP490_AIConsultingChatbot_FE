"use client";

import { MoreVertical } from "lucide-react";

const employees = [
  { id: 1, name: "Nguyễn Văn A", email: "a.nguyen@company.com", department: "Engineering", role: "Developer", status: "active" },
  { id: 2, name: "Trần Thị B", email: "b.tran@company.com", department: "Sales", role: "Sales Manager", status: "active" },
  { id: 3, name: "Lê Văn C", email: "c.le@company.com", department: "Marketing", role: "Marketing Specialist", status: "active" },
];

export function EmployeesTable() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Name</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Email</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Department</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Role</th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Status</th>
              <th className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {employees.map((emp) => (
              <tr key={emp.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{emp.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">{emp.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">{emp.department}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">{emp.role}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-green-600 dark:text-green-400">
                    Active
                  </span>
                </td>
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
