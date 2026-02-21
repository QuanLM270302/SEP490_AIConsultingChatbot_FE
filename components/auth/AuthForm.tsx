"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { setAuth } from "@/lib/auth-store";

type AuthMode = "login" | "register";

type UserRole = "super-admin" | "tenant-admin" | "employee" | "content-manager";

interface AuthFormProps {
  mode: AuthMode;
  showRoleSelector?: boolean;
}

const AUTH_ROLES: { value: UserRole; label: string }[] = [
  { value: "super-admin", label: "Super Admin" },
  { value: "tenant-admin", label: "Tenant Admin" },
  { value: "employee", label: "Employee" },
  { value: "content-manager", label: "Content Manager" },
];

/** Map backend role (e.g. ROLE_EMPLOYEE) to app path */
function roleToPath(roles: string[]): string {
  const role = roles[0] ?? "";
  if (role.includes("SUPER_ADMIN")) return "/super-admin";
  if (role.includes("TENANT_ADMIN")) return "/tenant-admin";
  if (role.includes("CONTENT_MANAGER")) return "/content-manager";
  if (role.includes("EMPLOYEE")) return "/employee";
  return "/employee";
}

export function AuthForm({ mode, showRoleSelector = false }: AuthFormProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (mode === "register") {
      // Register not implemented in backend auth; keep placeholder behavior
      console.log("Register with email/password as", role);
      return;
    }

    if (mode === "login") {
      setLoading(true);
      try {
        const data = await login({ email, password });
        setAuth(data);
        const path = roleToPath(data.roles);
        router.push(path);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter your credentials to{" "}
          {mode === "login" ? "access" : "start using"} the internal consultant chatbot.
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

        {mode === "register" && (
          <div className="space-y-1.5 text-left">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              placeholder="••••••••"
            />
          </div>
        )}

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
          {loading ? "Signing in…" : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </div>
  );
}
