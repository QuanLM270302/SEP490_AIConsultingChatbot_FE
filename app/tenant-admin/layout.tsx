
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";

export default function TenantAdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TenantAdminLayout>{children}</TenantAdminLayout>;
}

