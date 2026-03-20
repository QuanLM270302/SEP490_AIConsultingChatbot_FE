"use client";

import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "500,000đ",
    period: "/month",
    users: "Up to 50 users",
    features: [
      "Basic AI Assistant",
      "5GB Document Storage",
      "Email Support",
      "Basic Analytics",
      "Mobile App Access",
    ],
    popular: false,
  },
  {
    name: "Business",
    price: "1,500,000đ",
    period: "/month",
    users: "Up to 200 users",
    features: [
      "Advanced AI Assistant",
      "50GB Document Storage",
      "Priority Support",
      "Advanced Analytics",
      "Custom Integrations",
      "API Access",
      "Team Collaboration",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    users: "Unlimited users",
    features: [
      "Custom AI Models",
      "Unlimited Storage",
      "24/7 Dedicated Support",
      "Advanced Security",
      "Custom Integration",
      "SLA Guarantee",
      "Training & Onboarding",
      "White-label Option",
    ],
    popular: false,
  },
];

export function PricingTiers() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {tiers.map((tier) => {
        const isPopular = tier.popular;
        
        return (
          <div
            key={tier.name}
            className={`relative rounded-3xl bg-white p-8 shadow-lg shadow-green-100/60 transition-all dark:bg-zinc-950 dark:shadow-black/40 ${
              isPopular ? "ring-2 ring-green-500" : ""
            }`}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {tier.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {tier.period}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {tier.users}
              </p>
            </div>

            <ul className="mb-8 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all ${
                isPopular
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              }`}
            >
              {tier.price === "Custom" ? "Contact Sales" : "Edit Plan"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
