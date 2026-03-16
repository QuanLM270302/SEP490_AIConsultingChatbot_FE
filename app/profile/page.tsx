"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import {
  UserCircleIcon,
  PencilSquareIcon,
  KeyIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { AppHeader } from "@/components/layout/AppHeader";
import { getStoredUser } from "@/lib/auth-store";
import { roleToPath } from "@/lib/auth-routes";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "@/lib/api/profile";
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/profile";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Change password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNew, setConfirmNew] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const mustChangePassword = getStoredUser()?.mustChangePassword ?? false;

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setPhoneNumber(data.phoneNumber ?? "");
        setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "");
        setAddress(data.address ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);
    setUpdateLoading(true);
    try {
      const body: UpdateProfileRequest = {
        phoneNumber: phoneNumber.trim() || null,
        dateOfBirth: dateOfBirth ? dateOfBirth : null,
        address: address.trim() || null,
      };
      const updated = await updateProfile(body);
      setProfile(updated);
      setUpdateSuccess(true);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNew) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordLoading(true);
    try {
      const body: ChangePasswordRequest = {
        oldPassword: mustChangePassword ? undefined : (oldPassword || undefined),
        newPassword,
      };
      await changePassword(body);
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmNew("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Change password failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-violet-400 dark:focus:ring-violet-400/30";
  const labelClass =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  if (loading) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-zinc-50 via-emerald-50/30 to-violet-50/30 dark:from-zinc-950 dark:via-emerald-950/20 dark:to-violet-950/20">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading profile…</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-zinc-50 via-emerald-50/30 to-violet-50/30 dark:from-zinc-950 dark:via-emerald-950/20 dark:to-violet-950/20">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-6 py-4 text-rose-800 shadow-lg dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
            {error ?? "Profile not found"}
          </div>
        </main>
      </div>
    );
  }

  const user = getStoredUser();
  const backHref = user?.roles?.length ? roleToPath(user.roles) : "/";

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-zinc-50 via-emerald-50/30 to-violet-50/30 dark:from-zinc-950 dark:via-emerald-950/20 dark:to-violet-950/20">
      <AppHeader />
      <main className="min-w-0 overflow-auto">
        {/* Back bar — full width like header */}
        <div className="border-b border-zinc-200/80 bg-white/80 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="mx-auto flex h-10 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow hover:shadow-emerald-500/10 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200"
            >
              <ArrowLeftIcon className="h-4 w-4 shrink-0" />
              <span>Back</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-6">
          <div className="min-w-0 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 p-5 text-white shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/25">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <UserCircleIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{profile.fullName || "Profile"}</h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/90">
                  <EnvelopeIcon className="h-3.5 w-3.5" />
                  {profile.email}
                </p>
                {profile.roleName && (
                  <span className="mt-1.5 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
                    {profile.roleName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cards row */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Personal info — emerald */}
            <section className="rounded-xl border-l-4 border-emerald-500 bg-white p-4 shadow-md shadow-emerald-500/10 dark:border-emerald-400 dark:bg-zinc-900/80 dark:shadow-emerald-900/20">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400">
                  <UserCircleIcon className="h-4 w-4" />
                </span>
                Personal information
              </h2>
              <dl className="space-y-3 text-sm">
                {[
                  { icon: EnvelopeIcon, label: "Email", value: profile.email },
                  { icon: UserCircleIcon, label: "Full name", value: profile.fullName },
                  { icon: PhoneIcon, label: "Phone", value: profile.phoneNumber ?? "—" },
                  { icon: CalendarDaysIcon, label: "Date of birth", value: formatDate(profile.dateOfBirth) },
                  { icon: MapPinIcon, label: "Address", value: profile.address ?? "—" },
                  { icon: BuildingOffice2Icon, label: "Role", value: profile.roleName ?? "—" },
                  { icon: BuildingOffice2Icon, label: "Department", value: profile.departmentName ?? "—" },
                  { icon: BuildingOffice2Icon, label: "Tenant", value: profile.tenantName ?? "—" },
                  { icon: ClockIcon, label: "Last login", value: formatDateTime(profile.lastLoginAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-2">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-100">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            {/* Update profile — violet */}
            <section className="rounded-xl border-l-4 border-violet-500 bg-white p-4 shadow-md shadow-violet-500/10 dark:border-violet-400 dark:bg-zinc-900/80 dark:shadow-violet-900/20">
              <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:bg-violet-400/20 dark:text-violet-400">
                  <PencilSquareIcon className="h-4 w-4" />
                </span>
                Update profile
              </h2>
              <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                Phone, date of birth, address. Name & department by Tenant Admin.
              </p>
              <form onSubmit={handleUpdate} className="space-y-3">
                {updateError && (
                  <p className="rounded-xl bg-rose-50 p-2.5 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
                    {updateError}
                  </p>
                )}
                {updateSuccess && (
                  <p className="rounded-xl bg-emerald-50 p-2.5 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                    Profile updated successfully.
                  </p>
                )}
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone</label>
                  <input id="phone" type="text" maxLength={20} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="dob" className={labelClass}>Date of birth</label>
                  <input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="address" className={labelClass}>Address</label>
                  <textarea id="address" rows={3} maxLength={500} value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
                </div>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full rounded-xl bg-linear-to-r from-violet-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-600 hover:to-purple-600 disabled:opacity-60"
                >
                  {updateLoading ? "Saving…" : "Save changes"}
                </button>
              </form>
            </section>

            {/* Change password — amber */}
            <section className="rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-md shadow-amber-500/10 dark:border-amber-400 dark:bg-zinc-900/80 dark:shadow-amber-900/20">
              <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400">
                  <KeyIcon className="h-4 w-4" />
                </span>
                Change password
              </h2>
              {mustChangePassword && (
                <p className="mb-3 text-xs text-amber-700 dark:text-amber-300">
                  First-time login: set a new password. Old password not required.
                </p>
              )}
              <form onSubmit={handleChangePassword} className="space-y-3">
                {passwordError && (
                  <p className="rounded-xl bg-rose-50 p-2.5 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
                    {passwordError}
                  </p>
                )}
                {passwordSuccess && (
                  <p className="rounded-xl bg-emerald-50 p-2.5 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                    Password updated successfully.
                  </p>
                )}
                {!mustChangePassword && (
                  <div>
                    <label htmlFor="oldPassword" className={labelClass}>Current password</label>
                    <input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputClass} />
                  </div>
                )}
                <div>
                  <label htmlFor="newPassword" className={labelClass}>New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="confirmNew" className={labelClass}>Confirm new password</label>
                  <input id="confirmNew" type="password" value={confirmNew} onChange={(e) => setConfirmNew(e.target.value)} className={inputClass} />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/30 transition hover:from-amber-600 hover:to-orange-600 disabled:opacity-60"
                >
                  {passwordLoading ? "Updating…" : "Change password"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
