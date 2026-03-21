"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
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
        const home = user?.roles ? roleToPath(user.roles) : "/employee";
        router.replace(home);
        return;
      }
      setChecked(true);
      return;
    }

    function finishCheck() {
      const user = getStoredUser();
      if (!user?.roles?.length) {
        router.replace("/login");
        return;
      }
      const segment = getPathSegment(pathname);
      const allowedRoles = PATH_ALLOWED_ROLES[segment] ?? [];
      if (!hasAllowedRole(user.roles, allowedRoles)) {
        router.replace(roleToPath(user.roles));
        return;
      }
      setChecked(true);
    }

    let token = getAccessToken();
    if (!token) {
      const refresh = getRefreshToken();
      if (refresh) {
        refreshAuth().then((ok) => {
          if (ok) finishCheck();
          else router.replace("/login");
        });
        return;
      }
      router.replace("/login");
      return;
    }

    finishCheck();
  }, [pathname, router]);

  if (!pathname) return null;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isPublic) return <>{children}</>;
  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500">Đang xác thực…</p>
      </div>
    );
  }
  return <>{children}</>;
}
