"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  refreshAuth,
} from "@/lib/auth-store";
import {
  PUBLIC_PATHS,
  PATH_ALLOWED_ROLES,
  getPathSegment,
  roleToPath,
  hasAllowedRole,
} from "@/lib/auth-routes";
import { getMySubscription } from "@/lib/api/subscription";

const REFRESH_TIMEOUT_MS = 12_000;
const SUBSCRIPTION_REQUIRED_PATHS = [
  "/chatbot",
  "/chatbot-new",
  "/tenant-admin/documents",
];

function needsActiveSubscription(pathname: string): boolean {
  return SUBSCRIPTION_REQUIRED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function hasUsableSubscriptionStatus(status?: string): boolean {
  const normalized = (status ?? "").toUpperCase();
  return normalized === "ACTIVE" || normalized === "TRIAL";
}

function refreshAuthWithTimeout(): Promise<boolean> {
  return Promise.race([
    refreshAuth(),
    new Promise<boolean>((resolve) => {
      window.setTimeout(() => resolve(false), REFRESH_TIMEOUT_MS);
    }),
  ]);
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (isPublic) {
      const token = getAccessToken();
      if (token) {
        const user = getStoredUser();
        const home = user?.roles ? roleToPath(user.roles) : "/chatbot-new";
        router.replace(home);
        return;
      }
      return;
    }

    setChecked(false);

    async function finishCheck() {
      try {
        const user = getStoredUser();
        if (!user?.roles?.length) {
          clearAuth();
          router.replace("/login");
          return;
        }
        const segment = getPathSegment(pathname);
        const allowedRoles = PATH_ALLOWED_ROLES[segment] ?? [];
        if (!hasAllowedRole(user.roles, allowedRoles, segment)) {
          router.replace(roleToPath(user.roles));
          return;
        }

        const isTenantAdmin = user.roles.some((role) => role.includes("TENANT_ADMIN"));
        if (isTenantAdmin && needsActiveSubscription(pathname)) {
          try {
            const subscription = await getMySubscription();
            if (!hasUsableSubscriptionStatus(subscription.status)) {
              router.replace("/tenant-admin?subscriptionRequired=1");
              return;
            }
          } catch {
            router.replace("/tenant-admin?subscriptionRequired=1");
            return;
          }
        }

        setChecked(true);
      } catch {
        clearAuth();
        router.replace("/login");
      }
    }

    const token = getAccessToken();
    if (!token) {
      const refresh = getRefreshToken();
      if (refresh) {
        void refreshAuthWithTimeout().then((ok) => {
          if (ok) void finishCheck();
          else {
            clearAuth();
            router.replace("/login");
          }
        });
        return;
      }
      router.replace("/login");
      return;
    }

    void finishCheck();
  }, [pathname, router]);

  if (!pathname) return null;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isPublic) return <>{children}</>;
  if (!checked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Đang xác thực…</p>
      </div>
    );
  }
  return <>{children}</>;
}
