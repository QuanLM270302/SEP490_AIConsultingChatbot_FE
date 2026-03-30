import { OnboardingRequests } from "@/components/super-admin/OnboardingRequests";
import { OnboardingStats } from "@/components/super-admin/OnboardingStats";

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Phê duyệt Onboarding
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Xét duyệt các yêu cầu đăng ký từ công ty mới
          </p>
        </div>

        <OnboardingStats />
        <OnboardingRequests />
      </div>
  );
}
