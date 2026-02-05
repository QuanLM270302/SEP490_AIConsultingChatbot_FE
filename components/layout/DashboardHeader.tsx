"use client";

import { Button } from "@/components/ui";
import { Menu, Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-zinc-700 dark:text-zinc-400 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button className="relative -m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800" />

          <button className="-m-1.5 flex items-center gap-x-2 p-1.5">
            <span className="sr-only">Open user menu</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <User className="h-5 w-5 text-white" />
            </div>
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-2 text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                Admin User
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
