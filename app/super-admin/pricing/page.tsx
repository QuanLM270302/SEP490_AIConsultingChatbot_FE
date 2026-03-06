import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { PricingTiers } from "@/components/super-admin/PricingTiers";
import { SubscriptionPlans } from "@/components/super-admin/SubscriptionPlans";

export default function PricingPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Subscription Tiers & Pricing
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Quản lý các gói dịch vụ và cấu trúc giá
          </p>
        </div>

        <PricingTiers />
        <SubscriptionPlans />
      </div>
    </SuperAdminLayout>
  );
}
