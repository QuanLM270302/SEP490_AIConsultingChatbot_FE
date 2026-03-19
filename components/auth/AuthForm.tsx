"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { setAuth } from "@/lib/auth-store";
import { roleToPath } from "@/lib/auth-routes";

type AuthMode = "login";

type UserRole = "super-admin" | "tenant-admin" | "employee" | "staff";

interface AuthFormProps {
  mode: AuthMode;
  showRoleSelector?: boolean;
}

const AUTH_ROLES: { value: UserRole; label: string }[] = [
  { value: "super-admin", label: "Super Admin" },
  { value: "tenant-admin", label: "Tenant Admin" },
  { value: "employee", label: "Employee" },
  { value: "staff", label: "Staff" },
];

export function AuthForm({ mode, showRoleSelector = false }: AuthFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mustChangePromptOpen, setMustChangePromptOpen] = useState(false);
  const [postLoginPath, setPostLoginPath] = useState<string>("/");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (mode === "login") {
      setLoading(true);
      try {
        const data = await login({ email, password });
        setAuth(data);
        const path = roleToPath(data.roles);
        if (data.mustChangePassword) {
          setPostLoginPath(path);
          setMustChangePromptOpen(true);
        } else {
          router.push(path);
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {"Welcome back"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your credentials to{" "}
            access the internal consultant chatbot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
            >
              {error}
            </div>
          )}
          {showRoleSelector && (
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              >
                {AUTH_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              placeholder="••••••••"
            />
          </div>

          {mode === "login" && (
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-50"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>

      {mustChangePromptOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/70" />
          <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Đổi mật khẩu lần đầu
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Tài khoản này đang được yêu cầu đổi mật khẩu để đảm bảo an toàn.
              Bạn có thể đổi ngay bây giờ hoặc tiếp tục dùng mật khẩu hiện tại và đổi sau trong trang hồ sơ.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setMustChangePromptOpen(false);
                  router.push(postLoginPath);
                  router.refresh();
                }}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={() => {
                  setMustChangePromptOpen(false);
                  router.push("/profile?mustChangePassword=1");
                  router.refresh();
                }}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Đổi mật khẩu ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
