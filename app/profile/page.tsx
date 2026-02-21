"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { getAccessToken } from "@/lib/auth-store";
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
import { getStoredUser } from "@/lib/auth-store";

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
  const router = useRouter();
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
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    getProfile(token)
      .then((data) => {
        setProfile(data);
        setPhoneNumber(data.phoneNumber ?? "");
        setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "");
        setAddress(data.address ?? "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setUpdateError(null);
    setUpdateSuccess(false);
    setUpdateLoading(true);
    try {
      const body: UpdateProfileRequest = {
        phoneNumber: phoneNumber.trim() || null,
        dateOfBirth: dateOfBirth ? dateOfBirth : null,
        address: address.trim() || null,
      };
      const updated = await updateProfile(token, body);
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
    const token = getAccessToken();
    if (!token) return;
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswordLoading(true);
    try {
      const body: ChangePasswordRequest = {
        oldPassword: mustChangePassword ? undefined : (oldPassword || undefined),
        newPassword,
      };
      await changePassword(token, body);
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
    "block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50";
  const labelClass =
    "block text-sm font-medium text-zinc-800 dark:text-zinc-200";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <AppSidebar />
        <main className="flex-1 px-6 py-10">
          <p className="text-zinc-500">Loading profile…</p>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <AppSidebar />
        <main className="flex-1 px-6 py-10">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
            {error ?? "Profile not found"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppSidebar />
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-2xl space-y-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Profile
          </h1>

          {/* View profile */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Personal information
            </h2>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Email (login)</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Full name</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{profile.fullName}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Phone</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{profile.phoneNumber ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Date of birth</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{formatDate(profile.dateOfBirth)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Address</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{profile.address ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Role</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{profile.roleName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Department</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{profile.departmentName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Tenant</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{profile.tenantName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Last login</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">{formatDateTime(profile.lastLoginAt)}</dd>
              </div>
            </dl>
          </section>

          {/* Update profile */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Update profile
            </h2>
            <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
              You can update phone, date of birth, and address. Full name and department can only be changed by Tenant Admin.
            </p>
            <form onSubmit={handleUpdate} className="space-y-4">
              {updateError && (
                <p className="rounded-lg bg-red-50 p-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
                  {updateError}
                </p>
              )}
              {updateSuccess && (
                <p className="rounded-lg bg-green-50 p-2 text-sm text-green-800 dark:bg-green-950/50 dark:text-green-200">
                  Profile updated successfully.
                </p>
              )}
              <div>
                <label htmlFor="phone" className={labelClass}>Phone</label>
                <input
                  id="phone"
                  type="text"
                  maxLength={20}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="dob" className={labelClass}>Date of birth</label>
                <input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="address" className={labelClass}>Address</label>
                <textarea
                  id="address"
                  rows={3}
                  maxLength={500}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={updateLoading}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {updateLoading ? "Saving…" : "Save changes"}
              </button>
            </form>
          </section>

          {/* Change password */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
              Change password
            </h2>
            {mustChangePassword && (
              <p className="mb-4 text-xs text-amber-700 dark:text-amber-300">
                First-time login: set a new password. Old password is not required.
              </p>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <p className="rounded-lg bg-red-50 p-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p className="rounded-lg bg-green-50 p-2 text-sm text-green-800 dark:bg-green-950/50 dark:text-green-200">
                  Password updated successfully.
                </p>
              )}
              {!mustChangePassword && (
                <div>
                  <label htmlFor="oldPassword" className={labelClass}>Current password</label>
                  <input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={inputClass}
                  />
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
                  placeholder="Min 8 chars, upper, lower, number, special"
                />
              </div>
              <div>
                <label htmlFor="confirmNew" className={labelClass}>Confirm new password</label>
                <input
                  id="confirmNew"
                  type="password"
                  value={confirmNew}
                  onChange={(e) => setConfirmNew(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {passwordLoading ? "Updating…" : "Change password"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
