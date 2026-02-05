import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OnboardingRequests } from "@/components/dashboard/OnboardingRequests";

export default function OnboardingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Duyệt Onboarding
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Phê duyệt các yêu cầu đăng ký từ công ty mới
          </p>
        </div>

        <OnboardingRequests />
      </div>
    </DashboardLayout>
  );
}
