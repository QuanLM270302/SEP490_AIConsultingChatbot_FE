import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { SubscriptionPlansTable } from "@/components/super-admin/SubscriptionPlansTable";

export default function PricingPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Subscription Plans
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quản lý các gói dịch vụ và giới hạn sử dụng theo từng plan.
          </p>
        </div>

        <SubscriptionPlansTable />
      </div>
    </SuperAdminLayout>
  );
}
