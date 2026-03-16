"use client";

import { MoreVertical, Download, Trash2, Eye } from "lucide-react";

const documents = [
  { id: 1, name: "HR Policy.pdf", department: "HR", size: "2.4MB", uploads: "2024-01-15", queries: 324, status: "active" },
  { id: 2, name: "IT Support Guide.pdf", department: "IT", size: "1.8MB", uploads: "2024-02-01", queries: 210, status: "active" },
  { id: 3, name: "Company Handbook.pdf", department: "All", size: "3.2MB", uploads: "2024-01-10", queries: 150, status: "active" },
  { id: 4, name: "Finance Policy.pdf", department: "Finance", size: "1.2MB", uploads: "2024-02-15", queries: 89, status: "active" },
  { id: 5, name: "Safety Guidelines.pdf", department: "Operations", size: "980KB", uploads: "2024-02-20", queries: 45, status: "indexing" },
];

export function DocumentsTable() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-100/60 dark:bg-zinc-950 dark:shadow-black/40">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-900">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Document
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Department
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Size
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Uploaded
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                AI Queries
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Status
              </th>
              <th className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-900 dark:bg-zinc-950">
            {documents.map((doc) => (
              <tr key={doc.id} className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">
                      {doc.name}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-900 dark:text-white">
                  {doc.department}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {doc.size}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                  {doc.uploads}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {doc.queries}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      doc.status === "active"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {doc.status === "active" ? "Active" : "Indexing"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-900">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-500 dark:hover:bg-zinc-900">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
