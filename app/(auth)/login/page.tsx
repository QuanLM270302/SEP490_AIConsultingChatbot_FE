import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col items-center justify-center border-zinc-200 bg-white px-6 py-12 dark:border-zinc-800 dark:bg-zinc-900 lg:w-1/2 lg:border-r lg:px-12 lg:py-16">
        <div className="w-full max-w-sm">
          <AuthForm mode="login" />
        </div>
      </div>

      <AuthHeroPanel>
        <blockquote className="mx-auto max-w-md">
          <p className="text-2xl font-medium leading-relaxed text-white/95 md:text-2xl">
            Your intelligent partner for internal policies, HR guidance, and
            company knowledge—powered by AI.
          </p>
          <footer className="mt-6 text-lg font-semibold uppercase tracking-wider text-emerald-400/90">
            Internal Consultant Platform
          </footer>
        </blockquote>
      </AuthHeroPanel>
    </div>
  );
}
