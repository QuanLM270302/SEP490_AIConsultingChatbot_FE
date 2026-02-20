import {
  StarIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

type SubscriptionTier = "Starter" | "Standard" | "Enterprise";

interface SubscriptionTierData {
  name: SubscriptionTier;
  price: string;
  period: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  features: string[];
  current: boolean;
}

interface SubscriptionTiersProps {
  selectedTier: SubscriptionTier;
  onTierSelect: (tier: SubscriptionTier) => void;
}

const subscriptionTiers: SubscriptionTierData[] = [
  {
    name: "Starter",
    price: "299.000đ",
    period: "tháng",
    icon: StarIcon,
    color: "from-amber-400 to-amber-500",
    borderColor: "border-amber-300",
    features: [
      "100 lượt chat/tháng",
      "Tài liệu cơ bản",
      "Độ chính xác 85-90%",
      "Hỗ trợ email",
    ],
    current: true,
  },
  {
    name: "Standard",
    price: "599.000đ",
    period: "tháng",
    icon: RocketLaunchIcon,
    color: "from-green-400 to-green-500",
    borderColor: "border-green-300",
    features: [
      "500 lượt chat/tháng",
      "Tài liệu mở rộng",
      "Độ chính xác 90-95%",
      "Hỗ trợ ưu tiên & xuất báo cáo",
    ],
    current: false,
  },
  {
    name: "Enterprise",
    price: "1.299.000đ",
    period: "tháng",
    icon: SparklesIcon,
    color: "from-purple-400 to-purple-500",
    borderColor: "border-purple-300",
    features: [
      "Chat không giới hạn",
      "Toàn bộ tài liệu",
      "Độ chính xác 95-98%",
      "Hỗ trợ 24/7, tùy chỉnh AI & API",
    ],
    current: false,
  },
];

export function SubscriptionTiers({
  selectedTier,
  onTierSelect,
}: SubscriptionTiersProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {subscriptionTiers.map((tier) => {
          const IconComponent = tier.icon;

          return (
            <div
              key={tier.name}
              className={`group relative overflow-hidden rounded-3xl border-2 ${
                tier.current
                  ? `${tier.borderColor} shadow-xl ${
                      tier.name === "Starter"
                        ? "bg-linear-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-zinc-950"
                        : tier.name === "Standard"
                        ? "bg-linear-to-br from-green-50 to-white dark:from-green-950/30 dark:to-zinc-950"
                        : "bg-linear-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-zinc-950"
                    }`
                  : "border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
              } p-8 transition-all hover:shadow-2xl`}
            >
              {tier.current && (
                <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                  Gói hiện tại
                </div>
              )}
              <div className="mb-6">
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${tier.color} text-white shadow-lg`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {tier.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {tier.price}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    /{tier.period}
                  </span>
                </div>
              </div>
              <ul className="mb-6 min-h-34 space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              {tier.current ? (
                <button
                  disabled
                  className="w-full rounded-xl bg-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  Đang sử dụng
                </button>
              ) : (
                <button
                  onClick={() => onTierSelect(tier.name)}
                  className={`w-full rounded-xl bg-linear-to-r ${tier.color} px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl`}
                >
                  {tier.name === "Enterprise"
                    ? "Liên hệ bán hàng"
                    : "Nâng cấp ngay"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

