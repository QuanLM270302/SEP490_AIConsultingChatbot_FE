import { Button } from "@/components/ui";
import { Edit } from "lucide-react";

const tiers = [
  { name: "Starter", price: "500,000đ", users: "Up to 50", features: ["Basic AI", "5GB Storage", "Email Support"] },
  { name: "Standard", price: "1,500,000đ", users: "Up to 200", features: ["Advanced AI", "50GB Storage", "Priority Support", "Analytics"] },
  { name: "Enterprise", price: "Custom", users: "Unlimited", features: ["Custom AI", "Unlimited Storage", "24/7 Support", "Advanced Analytics", "Custom Integration"] },
];

export function PricingTiers() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((tier) => (
        <div key={tier.name} className="rounded-3xl border-2 border-zinc-100 bg-white p-6 shadow-lg shadow-green-100/60 transition hover:border-green-500/20 dark:border-zinc-900 dark:bg-zinc-950 dark:shadow-black/40">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{tier.name}</h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">{tier.price}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{tier.users} users</p>
          <ul className="mt-6 space-y-2">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-xs text-green-500">✓</span> {feature}
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-6 w-full">
            <Edit className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>
        </div>
      ))}
    </div>
  );
}
