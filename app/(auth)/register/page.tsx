"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [representativePosition, setRepresentativePosition] = useState("");
  const [representativePhone, setRepresentativePhone] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register-tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          address,
          website,
          companySize,
          contactEmail,
          representativeName,
          representativePosition,
          representativePhone,
          requestMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen">
        {/* Left: Success message */}
        <div className="flex w-full flex-col items-center justify-center border-zinc-200 bg-white px-6 py-12 dark:border-zinc-800 dark:bg-zinc-900 lg:w-1/2 lg:border-r lg:px-12 lg:py-16">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Registration Submitted!
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Your tenant registration request has been submitted successfully. Our team will review your application and contact you soon.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-700"
              >
                Back to Home
              </Link>
              <Link
                href="/login"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>

        <AuthHeroPanel>
          <blockquote className="mx-auto max-w-md">
            <p className="text-2xl font-medium leading-relaxed text-white/95 md:text-2xl">
              You&apos;re on your way. We&apos;ll review your request and get back to you soon.
            </p>
            <footer className="mt-6 text-lg font-semibold uppercase tracking-wider text-emerald-400/90">
              Internal Consultant Platform
            </footer>
          </blockquote>
        </AuthHeroPanel>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Register form */}
      <div className="flex w-full flex-col items-center justify-center border-zinc-200 bg-white px-6 py-12 dark:border-zinc-800 dark:bg-zinc-900 lg:w-1/2 lg:border-r lg:px-12 lg:py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Apply Now
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Register your organization to get started with our AI-powered internal consultant.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="companyName" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Company Name *
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="Acme Corporation"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Contact Email *
              </label>
              <input
                id="contactEmail"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="contact@company.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="representativeName" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Representative Name
                </label>
                <input
                  id="representativeName"
                  type="text"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="representativePosition" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Position
                </label>
                <input
                  id="representativePosition"
                  type="text"
                  value={representativePosition}
                  onChange={(e) => setRepresentativePosition(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="CEO"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="representativePhone" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Phone Number
              </label>
              <input
                id="representativePhone"
                type="tel"
                value={representativePhone}
                onChange={(e) => setRepresentativePhone(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="+84 123 456 789"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="address" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="123 Main St, City"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="website" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  placeholder="https://company.com"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="companySize" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Company Size
                </label>
                <select
                  id="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="requestMessage" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Message (Optional)
              </label>
              <textarea
                id="requestMessage"
                rows={3}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                placeholder="Tell us about your needs..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      <AuthHeroPanel>
        <blockquote className="mx-auto max-w-md">
          <p className="text-2xl font-medium leading-relaxed text-white/95 md:text-2xl">
            Join companies using AI to make internal knowledge accessible to everyone.
          </p>
          <footer className="mt-6 text-lg font-semibold uppercase tracking-wider text-emerald-400/90">
            Internal Consultant Platform
          </footer>
        </blockquote>
      </AuthHeroPanel>
    </div>
  );
}

