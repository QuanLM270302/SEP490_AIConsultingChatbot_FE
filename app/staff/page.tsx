"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { ClipboardDocumentCheckIcon, ChartBarIcon, UserGroupIcon, EnvelopeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const cards = [
  {
    title: "Review Tenant Requests",
    description: "Xem và duyệt các yêu cầu đăng ký tenant mới gửi lên hệ thống.",
    icon: ClipboardDocumentCheckIcon,
    color: "from-emerald-500 to-lime-500",
  },
  {
    title: "Approve / Reject Tenant",
    description: "Phê duyệt hoặc từ chối yêu cầu, kèm lý do rõ ràng cho từng tenant.",
    icon: ShieldCheckIcon,
    color: "from-sky-500 to-cyan-500",
  },
  {
    title: "Assign Subscriptions",
    description: "Gán gói Subscription phù hợp cho tenant sau khi được duyệt.",
    icon: UserGroupIcon,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Monitor Platform Activity",
    description: "Theo dõi hoạt động toàn hệ thống, đảm bảo nền tảng vận hành ổn định.",
    icon: ChartBarIcon,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Send Notifications",
    description: "Gửi email thông báo phê duyệt / từ chối tới Tenant Admin.",
    icon: EnvelopeIcon,
    color: "from-rose-500 to-red-500",
  },
];

export default function StaffDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-zinc-100 via-white to-zinc-100 text-zinc-900 dark:from-zinc-900 dark:via-black dark:to-zinc-900">
      <AppHeader />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header */}
          <section className="overflow-hidden rounded-3xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-xl shadow-emerald-500/30 dark:shadow-emerald-900/40">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Staff Dashboard
                </h1>
                <p className="mt-1 max-w-xl text-sm text-emerald-50/90">
                  Trung tâm điều phối cho đội ngũ Staff: duyệt tenant, gán subscription và giám sát hoạt động toàn nền tảng.
                </p>
              </div>
            </div>
          </section>

          {/* Core functions */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Core functions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="group relative overflow-hidden rounded-3xl bg-zinc-950 text-zinc-50 shadow-lg shadow-emerald-500/10 ring-1 ring-zinc-800/80 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/20"
                >
                  <div className={`absolute inset-x-0 top-0 h-20 bg-linear-to-r ${card.color} opacity-70 blur-2xl`} />
                  <div className="relative flex flex-col gap-3 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900/90 text-emerald-300 ring-1 ring-emerald-500/40">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{card.title}</h3>
                      <p className="mt-1 text-xs text-zinc-400">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

