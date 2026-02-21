"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Forgot password
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter your email and we&apos;ll send you an OTP to reset your password.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-200"
            >
              OTP has been sent to your email. Please check your inbox.
            </div>
            <Link
              href="/login"
              className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200"
              >
                {error}
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
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50"
            >
              {loading ? "Sending…" : "Send OTP"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/login" className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
