"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Lock } from "lucide-react";
import { SUBSCRIPTION_EXPIRED_EVENT, type SubscriptionExpiredDetail } from "@/lib/subscription-expired-modal";
import { useLanguageStore } from "@/lib/language-store";

export function SubscriptionExpiredModal() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState<SubscriptionExpiredDetail | null>(null);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const customEvent = event as CustomEvent<SubscriptionExpiredDetail>;
      setDetail(customEvent.detail);
      setIsOpen(true);
    };

    window.addEventListener(SUBSCRIPTION_EXPIRED_EVENT, handleEvent);
    return () => {
      window.removeEventListener(SUBSCRIPTION_EXPIRED_EVENT, handleEvent);
    };
  }, []);

  if (!isOpen || !detail) return null;

  const handleRenew = () => {
    setIsOpen(false);
    if (detail.onRenew) {
      detail.onRenew();
    } else {
      router.push("/tenant-admin/subscription");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
              <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {isEn ? "Subscription Expired" : "🔒 Gói đăng ký đã hết hạn"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 space-y-2">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {isEn
              ? "Your company's subscription has expired."
              : "Gói dịch vụ của công ty bạn đã hết hạn."}
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {isEn
              ? "Please renew to continue using this feature."
              : "Vui lòng gia hạn để tiếp tục sử dụng tính năng này."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleRenew}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            {isEn ? "Go to Renewal" : "Đi đến trang gia hạn"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {isEn ? "Close" : "Đóng"}
          </button>
        </div>
      </div>
    </div>
  );
}
