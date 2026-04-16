"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth-store";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all auth data
    clearAuth();
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login
    router.replace("/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Logging out...</p>
      </div>
    </div>
  );
}
