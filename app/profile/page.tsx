"use client";

import { useEffect, useState, useRef, useMemo, FormEvent } from "react";
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
} from "@heroicons/react/24/outline";
import { AppHeader } from "@/components/layout/AppHeader";
import { getStoredUser } from "@/lib/auth-store";
import {
  getProfile,
  updateProfile,
  changePassword,
  requestUpdateContactEmail,
  verifyAndUpdateContactEmail,
} from "@/lib/api/profile";
import type {
  UserProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/profile";
import {
  formatDobDigitsInput,
  formatDobDisplay,
  isoDateToDdMmYyyy,
  isAtLeastYearsOld,
  parseDdMmYyyy,
  validateDobForSubmit,
  type DobValidationMessages,
} from "@/lib/date-of-birth";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";

function formatDateTime(iso: string | null, locale: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(locale);
  } catch {
    return iso;
  }
}

export default function ProfilePage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const dateLocale = language === "vi" ? "vi-VN" : "en-US";

  const dobMessages: DobValidationMessages = useMemo(
    () => ({
      formatInvalid: t.profileDobFormatInvalid,
      dateInvalid: t.profileDobDateInvalid,
      under18: t.profileDobUnder18,
    }),
    [t.profileDobFormatInvalid, t.profileDobDateInvalid, t.profileDobUnder18]
  );

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update form state
  const [phoneNumber, setPhoneNumber] = useState("");
  /** Hiển thị/nhập dd/mm/yyyy; khi gửi API chuyển sang ISO trong handleUpdate */
  const [dateOfBirthDisplay, setDateOfBirthDisplay] = useState("");
  /** Cảnh báo tuổi: chỉ sau khi user sửa DOB và lần đầu nhập đủ ngày hợp lệ nhưng chưa đủ 18 */
  const [dobUnder18Notice, setDobUnder18Notice] = useState<string | null>(null);
  const dobEditedRef = useRef(false);
  const under18NoticeShownRef = useRef(false);
  const dobPickerRef = useRef<HTMLInputElement>(null);
  const dobPickerIsoValue = useMemo(() => {
    const r = parseDdMmYyyy(dateOfBirthDisplay, dobMessages);
    if (r.ok && r.iso) return r.iso;
    return "";
  }, [dateOfBirthDisplay, dobMessages]);
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

  // Contact email update (OTP) state
  const [newContactEmail, setNewContactEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const prettifyContactEmailError = (message: string) => {
    const m = message || "";
    if (
      /PKIX path building failed/i.test(m) ||
      /SSLHandshakeException/i.test(m) ||
      /unable to find valid certification path/i.test(m)
    ) {
      return `${t.profileContactEmailErrorTls} ${t.profileContactEmailHelp}`;
    }
    if (/Mail server connection failed/i.test(m) || /MessagingException/i.test(m)) {
      return `${t.profileContactEmailErrorMailServer} ${t.profileContactEmailHelp}`;
    }
    return message;
  };

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setPhoneNumber(data.phoneNumber ?? "");
        setDateOfBirthDisplay(isoDateToDdMmYyyy(data.dateOfBirth));
        setAddress(data.address ?? "");
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : t.profilePageError)
      )
      .finally(() => setLoading(false));
  }, [t.profilePageError]);

  useEffect(() => {
    if (!dobEditedRef.current) return;
    const r = parseDdMmYyyy(dateOfBirthDisplay, dobMessages);
    if (!r.ok || r.iso === null) {
      setDobUnder18Notice(null);
      under18NoticeShownRef.current = false;
      return;
    }
    const [y, mo, d] = r.iso.split("-").map(Number);
    const birth = new Date(y, mo - 1, d);
    if (isAtLeastYearsOld(birth, 18)) {
      setDobUnder18Notice(null);
      under18NoticeShownRef.current = false;
      return;
    }
    if (!under18NoticeShownRef.current) {
      setDobUnder18Notice(t.profileDobUnder18);
      under18NoticeShownRef.current = true;
    }
  }, [dateOfBirthDisplay, dobMessages, t.profileDobUnder18]);

  useEffect(() => {
    setDobUnder18Notice((prev) => (prev !== null ? t.profileDobUnder18 : null));
  }, [language, t.profileDobUnder18]);

  const openDobPicker = () => {
    dobEditedRef.current = true;
    const el = dobPickerRef.current;
    if (!el) return;
    const picker = (el as HTMLInputElement & { showPicker?: () => void })
      .showPicker;
    if (typeof picker === "function") {
      try {
        picker.call(el);
      } catch {
        el.click();
      }
    } else {
      el.click();
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);
    setUpdateLoading(true);
    try {
      const dobCheck = validateDobForSubmit(dateOfBirthDisplay, dobMessages);
      if (!dobCheck.ok) {
        const alreadyShownUnder18 =
          dobCheck.message === t.profileDobUnder18 && dobUnder18Notice !== null;
        if (!alreadyShownUnder18) {
          setUpdateError(dobCheck.message);
        }
        setUpdateLoading(false);
        return;
      }
      const body: UpdateProfileRequest = {
        phoneNumber: phoneNumber.trim() || null,
        dateOfBirth: dobCheck.iso,
        address: address.trim() || null,
      };
      const updated = await updateProfile(body);
      setProfile(updated);
      setUpdateSuccess(true);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : t.profileUpdateFailed);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (newPassword !== confirmNew) {
      setPasswordError(t.profilePasswordMismatch);
      return;
    }
    if (!passwordPattern.test(newPassword)) {
      setPasswordError(t.profilePasswordPolicy);
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
      setPasswordError(
        err instanceof Error ? err.message : t.profileChangePasswordFailed
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setContactSuccess(null);
    setContactLoading(true);
    try {
      await requestUpdateContactEmail({ newContactEmail: newContactEmail.trim() });
      setOtpSent(true);
      setContactSuccess(t.profileOtpSentSuccess);
    } catch (err) {
      const raw = err instanceof Error ? err.message : t.profileRequestOtpFailed;
      setContactError(prettifyContactEmailError(raw));
    } finally {
      setContactLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setContactError(null);
    setContactSuccess(null);
    setContactLoading(true);
    try {
      await verifyAndUpdateContactEmail({
        newContactEmail: newContactEmail.trim(),
        otp: otp.trim(),
      });
      setContactSuccess(t.profileContactEmailUpdatedSuccess);
      setOtp("");
      setOtpSent(false);
      const refreshed = await getProfile();
      setProfile(refreshed);
    } catch (err) {
      const raw = err instanceof Error ? err.message : t.profileVerifyOtpFailed;
      setContactError(prettifyContactEmailError(raw));
    } finally {
      setContactLoading(false);
    }
  };

  const inputClass =
    "block w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-violet-400 dark:focus:ring-violet-400/30";
  /** Một viền: text + icon lịch cuối dòng */
  const dobCompositeClass =
    "flex w-full min-w-0 items-stretch rounded-xl border border-zinc-200 bg-white/80 text-sm text-zinc-900 shadow-sm outline-none transition focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/30 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus-within:border-violet-400 dark:focus-within:ring-violet-400/30";
  const labelClass =
    "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  if (loading) {
    return (
      <div className="min-h-dvh overflow-x-hidden bg-white dark:bg-zinc-950">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {t.profilePageLoading}
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-dvh overflow-x-hidden bg-white dark:bg-zinc-950">
        <AppHeader />
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/90 px-6 py-4 text-rose-800 shadow-lg dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
            {error ?? t.profilePageNotFound}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh overflow-x-hidden bg-white dark:bg-zinc-950">
      <AppHeader />
      <main className="min-w-0 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-6">
          <div className="min-w-0 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 p-5 text-white shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/25">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                <UserCircleIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {profile.fullName || t.profile}
                </h1>
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
          <div className="grid gap-4 lg:grid-cols-4">
            {/* Personal info — emerald */}
            <section className="h-full rounded-xl border-l-4 border-emerald-500 bg-white p-4 shadow-md shadow-emerald-500/10 dark:border-emerald-400 dark:bg-zinc-900/80 dark:shadow-emerald-900/20">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400">
                  <UserCircleIcon className="h-4 w-4" />
                </span>
                {t.profilePersonalInformation}
              </h2>
              <dl className="space-y-3 text-sm">
                {[
                  { icon: EnvelopeIcon, label: t.email, value: profile.email },
                  { icon: EnvelopeIcon, label: t.contactEmail, value: profile.contactEmail ?? "—" },
                  { icon: UserCircleIcon, label: t.fullName, value: profile.fullName },
                  { icon: PhoneIcon, label: t.phone, value: profile.phoneNumber ?? "—" },
                  {
                    icon: CalendarDaysIcon,
                    label: t.profileDateOfBirth,
                    value: formatDobDisplay(profile.dateOfBirth),
                  },
                  { icon: MapPinIcon, label: t.address, value: profile.address ?? "—" },
                  { icon: BuildingOffice2Icon, label: t.role, value: profile.roleName ?? "—" },
                  {
                    icon: BuildingOffice2Icon,
                    label: t.department,
                    value: profile.departmentName ?? "—",
                  },
                  { icon: BuildingOffice2Icon, label: t.tenant, value: profile.tenantName ?? "—" },
                  {
                    icon: ClockIcon,
                    label: t.profileLastLogin,
                    value: formatDateTime(profile.lastLoginAt, dateLocale),
                  },
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
            <section className="h-full rounded-xl border-l-4 border-violet-500 bg-white p-4 shadow-md shadow-violet-500/10 dark:border-violet-400 dark:bg-zinc-900/80 dark:shadow-violet-900/20">
              <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:bg-violet-400/20 dark:text-violet-400">
                  <PencilSquareIcon className="h-4 w-4" />
                </span>
                {t.profileUpdateProfile}
              </h2>
              <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                {t.profileUpdateProfileHint}
              </p>
              <form onSubmit={handleUpdate} className="space-y-3">
                {updateError && (
                  <p className="rounded-xl bg-rose-50 p-2.5 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
                    {updateError}
                  </p>
                )}
                {updateSuccess && (
                  <p className="rounded-xl bg-emerald-50 p-2.5 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                    {t.profileUpdatedSuccessfully}
                  </p>
                )}
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {t.phone}
                  </label>
                  <input id="phone" type="text" maxLength={20} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="dob" className={labelClass}>
                    {t.profileDateOfBirth}
                  </label>
                  <div className={dobCompositeClass}>
                    <input
                      id="dob"
                      type="text"
                      inputMode="numeric"
                      autoComplete="bday"
                      placeholder={t.profileDobPlaceholder}
                      maxLength={10}
                      value={dateOfBirthDisplay}
                      onChange={(e) => {
                        dobEditedRef.current = true;
                        setDateOfBirthDisplay(formatDobDigitsInput(e.target.value));
                      }}
                      className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 outline-none focus:ring-0 dark:bg-transparent"
                    />
                    <input
                      ref={dobPickerRef}
                      type="date"
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden
                      value={dobPickerIsoValue}
                      onChange={(e) => {
                        const v = e.target.value;
                        dobEditedRef.current = true;
                        if (v) setDateOfBirthDisplay(isoDateToDdMmYyyy(v));
                      }}
                    />
                    <button
                      type="button"
                      onClick={openDobPicker}
                      className="flex shrink-0 items-center justify-center rounded-r-xl px-2.5 py-2.5 text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/15"
                      title={t.profileDobPickFromCalendar}
                      aria-label={t.profileDobOpenCalendar}
                    >
                      <CalendarDaysIcon className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                  {dobUnder18Notice && (
                    <div
                      className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
                      role="alert"
                    >
                      {dobUnder18Notice}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className={labelClass}>
                    {t.address}
                  </label>
                  <textarea id="address" rows={3} maxLength={500} value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
                </div>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full rounded-xl bg-linear-to-r from-violet-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-600 hover:to-purple-600 disabled:opacity-60"
                >
                  {updateLoading ? t.profileSaving : t.profileSaveChanges}
                </button>
              </form>
            </section>

            {/* Contact email (OTP) — cyan */}
            <section className="h-full rounded-xl border-l-4 border-cyan-500 bg-white p-4 shadow-md shadow-cyan-500/10 dark:border-cyan-400 dark:bg-zinc-900/80 dark:shadow-cyan-900/20">
              <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-600 dark:bg-cyan-400/20 dark:text-cyan-400">
                  <EnvelopeIcon className="h-4 w-4" />
                </span>
                {t.profileUpdateContactEmail}
              </h2>
              <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                {t.profileUpdateContactEmailHint}
              </p>
              {contactError && (
                <p className="mb-3 rounded-xl bg-rose-50 p-2.5 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
                  {contactError}
                </p>
              )}
              {contactSuccess && (
                <p className="mb-3 rounded-xl bg-emerald-50 p-2.5 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                  {contactSuccess}
                </p>
              )}
              <form onSubmit={otpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-3">
                <div>
                  <label htmlFor="newContactEmail" className={labelClass}>
                    {t.profileNewContactEmailLabel}
                  </label>
                  <input
                    id="newContactEmail"
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className={inputClass}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                {otpSent && (
                  <div>
                    <label htmlFor="otp" className={labelClass}>
                      {t.profileOtpSixDigits}
                    </label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={inputClass}
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-600 hover:to-sky-600 disabled:opacity-60"
                >
                  {contactLoading
                    ? t.profileProcessing
                    : otpSent
                      ? t.profileVerifyOtpUpdate
                      : t.profileSendOtp}
                </button>
                {otpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setContactSuccess(null);
                      setContactError(null);
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {t.profileResendOrChangeEmail}
                  </button>
                )}
              </form>
            </section>

            {/* Change password — amber */}
            <section className="h-full rounded-xl border-l-4 border-amber-500 bg-white p-4 shadow-md shadow-amber-500/10 dark:border-amber-400 dark:bg-zinc-900/80 dark:shadow-amber-900/20">
              <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400">
                  <KeyIcon className="h-4 w-4" />
                </span>
                {t.profileChangePasswordTitle}
              </h2>
              {mustChangePassword && (
                <p className="mb-3 text-xs text-amber-700 dark:text-amber-300">
                  {t.profileFirstLoginPasswordHint}
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
                    {t.profilePasswordUpdatedSuccess}
                  </p>
                )}
                {!mustChangePassword && (
                  <div>
                    <label htmlFor="oldPassword" className={labelClass}>
                      {t.profileCurrentPasswordLabel}
                    </label>
                    <input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputClass} />
                  </div>
                )}
                <div>
                  <label htmlFor="newPassword" className={labelClass}>
                    {t.profileNewPasswordLabel}
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="confirmNew" className={labelClass}>
                    {t.profileConfirmPasswordLabel}
                  </label>
                  <input id="confirmNew" type="password" value={confirmNew} onChange={(e) => setConfirmNew(e.target.value)} className={inputClass} />
                </div>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/30 transition hover:from-amber-600 hover:to-orange-600 disabled:opacity-60"
                >
                  {passwordLoading
                    ? t.profileUpdatingPassword
                    : t.profileChangePasswordButton}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
