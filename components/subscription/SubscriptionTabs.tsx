type TabType = "plans" | "billing" | "history";

interface SubscriptionTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function SubscriptionTabs({
  activeTab,
  onTabChange,
}: SubscriptionTabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: "plans", label: "Gói đăng ký" },
    { id: "billing", label: "Thanh toán" },
    { id: "history", label: "Lịch sử giao dịch" },
  ];

  return (
    <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-sm font-semibold transition ${
            activeTab === tab.id
              ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

