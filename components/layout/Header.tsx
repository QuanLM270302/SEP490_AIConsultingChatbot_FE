"use client";

import { Button } from "@/components/ui";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold text-blue-600">AI Chatbot</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-700 dark:text-zinc-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#features" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Tính năng
          </a>
          <a href="#integrations" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Tích hợp
          </a>
          <a href="#pricing" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Giá cả
          </a>
          <a href="#docs" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            Tài liệu
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Dùng thử miễn phí
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-6 pb-6 pt-2">
            <a
              href="#features"
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800"
            >
              Tính năng
            </a>
            <a
              href="#integrations"
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800"
            >
              Tích hợp
            </a>
            <a
              href="#pricing"
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800"
            >
              Giá cả
            </a>
            <a
              href="#docs"
              className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800"
            >
              Tài liệu
            </a>
            <div className="mt-4 space-y-2">
              <Link href="/login" className="block">
                <Button variant="ghost" size="md" className="w-full">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register" className="block">
                <Button variant="primary" size="md" className="w-full">
                  Dùng thử miễn phí
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
