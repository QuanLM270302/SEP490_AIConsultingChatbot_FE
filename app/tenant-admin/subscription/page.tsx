import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { SubscriptionInfo } from "@/components/tenant-admin/SubscriptionInfo";
import { UsageLimits } from "@/components/tenant-admin/UsageLimits";
import { BillingHistory } from "@/components/tenant-admin/BillingHistory";

export default function SubscriptionPage() {
  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Subscription & Billing
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quản lý gói dịch vụ và thanh toán
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <SubscriptionInfo />
          <UsageLimits />
        </div>

        <BillingHistory />
      </div>
    </TenantAdminLayout>
  );
}
