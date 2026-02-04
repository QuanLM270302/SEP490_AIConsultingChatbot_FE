import { Header } from "@/components/layout/Header";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Đăng nhập
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
