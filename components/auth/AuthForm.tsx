"use client";

import { useState, FormEvent } from "react";

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

export function AuthForm({ mode, showRoleSelector = false }: AuthFormProps) {
  const [role, setRole] = useState<UserRole>("employee");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Call your auth API here; the backend should return the user's role
    // based on the account, and then you can redirect by role on success.
    console.log(
      `${mode.toUpperCase()} with email/password${
        showRoleSelector ? ` as ${role}` : ""
      }`
    );
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter your credentials to{" "}
          {mode === "login" ? "access" : "start using"} the internal consultant chatbot.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            <button
              type="button"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50"
        >
          {mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </div>
  );
}

