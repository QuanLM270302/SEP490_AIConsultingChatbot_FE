"use client";

import { Button } from "@/components/ui";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl">
            AI Chatbot nội bộ cho
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"> doanh nghiệp</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
            Trao quyền cho nhân viên với trợ lý AI thông minh, kết nối toàn bộ kiến thức doanh nghiệp. 
            Tìm kiếm nhanh, trả lời chính xác, tăng năng suất làm việc.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="primary">
                Dùng thử miễn phí
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Xem demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-500">
            Triển khai trong 3 tuần • Không cần credit card
          </p>
        </div>

        <div className="mt-16 sm:mt-24">
          <div className="relative rounded-xl bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 dark:bg-zinc-800/50 dark:ring-zinc-800 lg:rounded-2xl lg:p-4">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
