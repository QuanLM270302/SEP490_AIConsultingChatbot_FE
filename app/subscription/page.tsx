"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/employee/subscription");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <p className="text-sm text-zinc-500">Đang chuyển hướng…</p>
    </div>
  );
}
