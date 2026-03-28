"use client";

import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import type { ReactNode } from "react";

export default function SuperAdminRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}

