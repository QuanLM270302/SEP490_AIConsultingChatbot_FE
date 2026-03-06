"use client";

import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { getStoredUser } from "@/lib/auth-store";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsSection } from "@/components/dashboard/MetricsSection";
import { QuestionsChart } from "@/components/dashboard/QuestionsChart";
import { DashboardRightSidebar } from "@/components/dashboard/DashboardRightSidebar";

function isSuperAdmin(roles: string[]): boolean {
  return roles.some((r) => r.includes("SUPER_ADMIN"));
}

const GUEST_FEATURES = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Hỏi đáp bằng AI",
    description: "Đặt câu hỏi bằng tiếng Việt, nhận câu trả lời chính xác dựa trên tài liệu nội bộ nhờ công nghệ RAG.",
  },
  {
    icon: DocumentTextIcon,
    title: "Tài liệu tập trung",
    description: "Truy cập chính sách, quy trình và hướng dẫn công ty từ một nơi, luôn cập nhật.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Bảo mật & phân quyền",
    description: "Multi-tenant, phân quyền theo vai trò: Nhân viên, Content Manager, Tenant Admin, Super Admin.",
  },
  {
    icon: SparklesIcon,
    title: "Nâng cấp linh hoạt",
    description: "Gói Starter, Standard, Enterprise phù hợp quy mô và nhu cầu từng tổ chức.",
  },
];

export function DashboardContent() {
  const user = getStoredUser();
  const roles = user?.roles ?? [];
  const showDetails = isSuperAdmin(roles);

  if (showDetails) {
    return (
      <>
        <main className="flex-1 px-0 py-2 sm:px-4 lg:px-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:max-w-6xl">
            <DashboardHeader />
            <MetricsSection />
            <QuestionsChart />
          </div>
        </main>
        <DashboardRightSidebar />
      </>
    );
  }

  return (
    <main className="flex-1 px-0 py-2 sm:px-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 lg:max-w-6xl">
        {/* Hero */}
        <section className="rounded-3xl bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 p-8 text-white shadow-lg dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 md:p-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Internal Consultant AI
          </h1>
          <p className="mt-3 max-w-2xl text-lg opacity-95">
            Nền tảng chatbot tư vấn nội bộ dựa trên tài liệu công ty. Hỏi đáp nhanh, chính xác, bảo mật — dành cho nhân viên và quản lý.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-green-700 shadow transition hover:bg-green-50"
            >
              Đăng nhập
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/80 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Đăng ký
            </Link>
          </div>
        </section>

        {/* Giới thiệu ngắn */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Giới thiệu
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Internal Consultant AI giúp nhân viên tra cứu chính sách, quy trình và tài liệu nội bộ thông qua hội thoại tự nhiên. Hệ thống sử dụng RAG (Retrieval-Augmented Generation) để trả lời dựa trên nguồn tài liệu được cấp quyền, đảm bảo thông tin chính xác và có thể kiểm chứng. Tổ chức có thể quản lý nhiều tenant, tài liệu và gói đăng ký phù hợp với quy mô sử dụng.
          </p>
        </section>

        {/* Tính năng — dàn đều */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GUEST_FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
