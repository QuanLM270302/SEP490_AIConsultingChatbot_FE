"use client";

import { Home, MessageSquare, Users, BookOpen, Settings, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChatSidebarProps {
  open: boolean;
  onNewChat: () => void;
}

const navigation = [
  { name: "Home", href: "/employee", icon: Home },
  { name: "Chat", href: "/employee/chatplatform", icon: MessageSquare },
  { name: "Directory", href: "/employee/directory", icon: Users },
  { name: "Knowledge", href: "/employee/knowledge", icon: BookOpen },
];

export function ChatSidebar({ open, onNewChat }: ChatSidebarProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <aside className="relative z-[110] flex w-14 flex-col items-center border-r border-zinc-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Logo */}
      <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <span className="text-sm font-bold">G</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-lg transition",
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              )}
              title={item.name}
            >
              <item.icon className="h-5 w-5" />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 dark:bg-zinc-700">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 text-zinc-700 transition hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          title="Profile"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
