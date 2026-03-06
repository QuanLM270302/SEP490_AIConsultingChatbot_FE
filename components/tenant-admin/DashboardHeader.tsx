"use client";

import { Menu, Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        type="button"
        className="rounded-2xl bg-white p-3 text-zinc-700 shadow-sm shadow-green-100/60 dark:bg-zinc-950 dark:text-zinc-400 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-3">
        <button className="relative rounded-2xl bg-white p-3 text-zinc-400 shadow-sm shadow-green-100/60 transition hover:text-zinc-500 dark:bg-zinc-950">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" />
        </button>

        <button className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm shadow-green-100/60 dark:bg-zinc-950">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-sm font-semibold text-zinc-900 dark:text-white lg:block">
            Tenant Admin
          </span>
        </button>
      </div>
    </div>
  );
}
