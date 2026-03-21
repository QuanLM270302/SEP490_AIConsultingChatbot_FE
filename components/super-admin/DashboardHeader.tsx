"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
        {/* User Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm shadow-green-100/60 transition hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden text-sm font-semibold text-zinc-900 dark:text-white lg:block">
              Admin User
            </span>
            <svg
              className={`hidden h-4 w-4 text-zinc-400 transition-transform lg:block ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              {/* User Info */}
              <div className="border-b border-zinc-200 bg-gradient-to-br from-emerald-50 to-white px-4 py-3 dark:border-zinc-800 dark:from-emerald-950/20 dark:to-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Admin User</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">admin@example.com</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => {
                    router.push("/settings");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-800" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
