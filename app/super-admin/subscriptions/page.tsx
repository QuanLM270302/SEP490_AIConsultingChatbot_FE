import { SuperAdminLayout } from "@/components/super-admin/SuperAdminLayout";
import { Check, Edit, Plus, Star } from "lucide-react";

type PlanItem = {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  popular: boolean;
  activeTenants: number;
};
const plans: PlanItem[] = [];

export default function SubscriptionsPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Subscription Plans
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Quản lý các gói dịch vụ và giới hạn tương ứng
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-offset-zinc-900">
            <Plus className="h-4 w-4" />
            Create Plan
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-zinc-950">
              <p className="text-sm text-zinc-500">Dữ liệu gói dịch vụ sẽ được tải từ API.</p>
            </div>
          ) : null}
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 shadow-sm ring-1 transition-all ${
                plan.popular 
                  ? "bg-white ring-green-500 dark:bg-zinc-900 dark:ring-green-500/50" 
                  : "bg-white ring-zinc-200 dark:bg-zinc-950 dark:ring-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white shadow-sm">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {plan.description}
                  </p>
                </div>
                <button className="text-zinc-400 hover:text-green-500 dark:hover:text-green-400">
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6 flex items-baseline text-zinc-900 dark:text-white">
                <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                <span className="ml-1 text-sm font-medium text-zinc-500">/{plan.interval}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex flex-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Active Tenants</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{plan.activeTenants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
}
