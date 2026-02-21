import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Login form */}
      <div className="flex w-full flex-col items-center justify-center border-zinc-200 bg-white px-6 py-12 dark:border-zinc-800 dark:bg-zinc-900 lg:w-1/2 lg:border-r lg:px-12 lg:py-16">
        <div className="w-full max-w-sm">
          <AuthForm mode="login" />
        </div>
      </div>

      {/* Right: Decorative panel — green & black, content centered */}
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-950 via-emerald-950/40 to-zinc-950" />
        {/* Soft orbs */}
        <div className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-700/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        {/* Subtle accents */}
        <div className="absolute right-[20%] top-[25%] h-1.5 w-1.5 rounded-full bg-emerald-400/50" />
        <div className="absolute right-[30%] bottom-[30%] h-2 w-2 rounded-full bg-emerald-500/40" />
        <div className="absolute left-[25%] top-[35%] h-3 w-3 rounded-full bg-emerald-400/30" />
        <div className="absolute left-[20%] bottom-[25%] h-1 w-1 rounded-full bg-emerald-300/40" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.6) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(16, 185, 129, 0.6) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Centered copy */}
        <div className="relative z-10 px-10 text-center lg:px-16">
          <blockquote className="mx-auto max-w-md">
            <p className="text-xl font-medium leading-relaxed text-white/95 md:text-2xl">
              Your intelligent partner for internal policies, HR guidance, and
              company knowledge—powered by AI.
            </p>
            <footer className="mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-400/90">
              Internal Consultant Platform
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
