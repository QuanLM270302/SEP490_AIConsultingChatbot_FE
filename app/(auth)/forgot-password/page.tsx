"use client";

import { useRef, useState, FormEvent, KeyboardEvent, ClipboardEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPassword, verifyResetOtp, resetPasswordForgot } from "@/lib/api/auth";
import {
  getNewPasswordValidationMessage,
  PASSWORD_HINT_VI,
  isValidResetSessionToken,
} from "@/lib/password-policy";

const OTP_LEN = 6;

type Step = "email" | "otp" | "password" | "done";
type Pulse = "idle" | "error" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpBoxes, setOtpBoxes] = useState<string[]>(() => Array(OTP_LEN).fill(""));
  const [resetSessionToken, setResetSessionToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailPulse, setEmailPulse] = useState<Pulse>("idle");
  const [otpPulse, setOtpPulse] = useState<Pulse>("idle");
  const [passwordPulse, setPasswordPulse] = useState<Pulse>("idle");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const inputClass =
    "block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition duration-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50";

  const otpBoxBase =
    "h-11 w-10 rounded-lg border-2 bg-white text-center text-lg font-semibold tracking-widest text-zinc-900 outline-none transition-[border-color,box-shadow,background-color] duration-200 sm:h-12 sm:w-11";

  const otpBoxClass = () => {
    if (otpPulse === "error") {
      return `${otpBoxBase} border-red-500 bg-red-50/80 shadow-[0_0_0_3px_rgba(239,68,68,0.25)] focus:border-red-600 focus:ring-2 focus:ring-red-500/30 dark:border-red-500 dark:bg-red-950/40 dark:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]`;
    }
    if (otpPulse === "success") {
      return `${otpBoxBase} border-emerald-500 bg-emerald-50/90 shadow-[0_0_20px_rgba(16,185,129,0.35)] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400/40 dark:border-emerald-400 dark:bg-emerald-950/50 dark:shadow-[0_0_24px_rgba(16,185,129,0.25)]`;
    }
    return `${otpBoxBase} border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-400/20`;
  };

  const emailInputClass =
    emailPulse === "error"
      ? `${inputClass} border-red-500 bg-red-50/60 ring-2 ring-red-500/25 dark:border-red-500 dark:bg-red-950/30 dark:ring-red-500/20`
      : emailPulse === "success"
        ? `${inputClass} border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/25 dark:border-emerald-500 dark:bg-emerald-950/30 dark:ring-emerald-500/20`
        : inputClass;

  const passwordFieldClass =
    passwordPulse === "error"
      ? `${inputClass} border-red-500 bg-red-50/60 ring-2 ring-red-500/25 dark:border-red-500 dark:bg-red-950/30`
      : passwordPulse === "success"
        ? `${inputClass} border-emerald-500/80 bg-emerald-50/40 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/25`
        : inputClass;

  const otpCode = otpBoxes.join("");

  const flashPulse = (setter: (p: Pulse) => void, kind: "error" | "success", ms: number) => {
    setter(kind);
    window.setTimeout(() => setter("idle"), ms);
  };

  const handleOtpBoxChange = (index: number, raw: string) => {
    if (otpPulse !== "idle") setOtpPulse("idle");
    const d = raw.replace(/\D/g, "").slice(-1);
    setOtpBoxes((prev) => {
      const next = [...prev];
      next[index] = d || "";
      return next;
    });
    if (d && index < OTP_LEN - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpBoxes[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (otpPulse !== "idle") setOtpPulse("idle");
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN).split("");
    setOtpBoxes(() => {
      const next = Array(OTP_LEN).fill("");
      digits.forEach((c, i) => {
        if (i < OTP_LEN) next[i] = c;
      });
      return next;
    });
    const len = digits.length;
    if (len > 0) {
      otpRefs.current[Math.min(len, OTP_LEN) - 1]?.focus();
    }
  };

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setEmailPulse("idle");
    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      flashPulse(setEmailPulse, "success", 700);
      setOtpBoxes(Array(OTP_LEN).fill(""));
      setResetSessionToken(null);
      window.setTimeout(() => setStep("otp"), 280);
    } catch (err) {
      flashPulse(setEmailPulse, "error", 700);
      setError(err instanceof Error ? err.message : "Không gửi được OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const code = otpCode;
    if (!/^\d{6}$/.test(code)) {
      flashPulse(setOtpPulse, "error", 650);
      setError("Mã OTP phải đúng 6 chữ số.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyResetOtp({ email: email.trim(), otp: code });
      setResetSessionToken(res.resetSessionToken);
      setOtpPulse("success");
      await new Promise((r) => window.setTimeout(r, 520));
      setOtpPulse("idle");
      setStep("password");
    } catch (err) {
      flashPulse(setOtpPulse, "error", 700);
      setError(err instanceof Error ? err.message : "OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPasswordPulse("idle");
    if (!resetSessionToken || !isValidResetSessionToken(resetSessionToken)) {
      setError("Phiên đặt lại mật khẩu không hợp lệ (token). Vui lòng xác thực OTP lại.");
      setStep("otp");
      return;
    }
    if (newPassword !== confirmPassword) {
      flashPulse(setPasswordPulse, "error", 700);
      setError("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    const pwdMsg = getNewPasswordValidationMessage(newPassword);
    if (pwdMsg) {
      flashPulse(setPasswordPulse, "error", 700);
      setError(pwdMsg);
      return;
    }
    setLoading(true);
    try {
      await resetPasswordForgot({
        resetSessionToken,
        newPassword,
      });
      setResetSessionToken(null);
      setPasswordPulse("success");
      await new Promise((r) => window.setTimeout(r, 400));
      setPasswordPulse("idle");
      setStep("done");
    } catch (err) {
      flashPulse(setPasswordPulse, "error", 700);
      setError(err instanceof Error ? err.message : "Không đổi được mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setOtpPulse("idle");
    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      setOtpBoxes(Array(OTP_LEN).fill(""));
      setResetSessionToken(null);
      flashPulse(setOtpPulse, "success", 600);
    } catch (err) {
      flashPulse(setOtpPulse, "error", 700);
      setError(err instanceof Error ? err.message : "Không gửi lại được OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Quên mật khẩu
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {step === "email" &&
              "Nhập email đăng nhập; mã có thể gửi tới email liên hệ nếu đã cấu hình."}
            {step === "otp" && "Nhập mã 6 số đã gửi tới email (hiệu lực 15 phút)."}
            {step === "password" &&
              "Phiên đặt lại mật khẩu còn hiệu lực khoảng 10 phút."}
            {step === "done" && "Mật khẩu đã được cập nhật."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key={error}
              role="alert"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: [0, -6, 6, -5, 5, -3, 3, 0],
              }}
              exit={{ opacity: 0, y: -4 }}
              transition={{
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
                scale: { duration: 0.2 },
                x: { duration: 0.45, ease: "easeInOut" },
              }}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 shadow-sm shadow-red-200/50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 dark:shadow-red-900/30"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {step === "done" ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 380, damping: 26 },
            }}
          >
            <motion.div
              role="status"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: [
                  "0 0 0 0 rgba(16, 185, 129, 0.45)",
                  "0 0 0 12px rgba(16, 185, 129, 0)",
                ],
              }}
              transition={{
                delay: 0.08,
                boxShadow: { duration: 0.85, ease: "easeOut" },
                default: { duration: 0.35 },
              }}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
            >
              Bạn có thể đăng nhập bằng mật khẩu mới.
            </motion.div>
            <Link
              href="/login"
              className="block w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Đăng nhập
            </Link>
          </motion.div>
        ) : step === "password" ? (
          <motion.form
            key="password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onSubmit={handleResetPassword}
            className="space-y-5"
          >
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Tài khoản:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span>
            </p>
            <p className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-3 py-2 text-xs leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
              {PASSWORD_HINT_VI}
            </p>
            <motion.div
              className="space-y-1.5 text-left"
              animate={
                passwordPulse === "error"
                  ? { x: [0, -8, 8, -8, 8, 0] }
                  : passwordPulse === "success"
                    ? { scale: [1, 1.02, 1] }
                    : {}
              }
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordPulse === "error") setPasswordPulse("idle");
                }}
                className={passwordFieldClass}
                placeholder="••••••"
              />
            </motion.div>
            <motion.div
              className="space-y-1.5 text-left"
              animate={
                passwordPulse === "error"
                  ? { x: [0, -8, 8, -8, 8, 0] }
                  : passwordPulse === "success"
                    ? { scale: [1, 1.02, 1] }
                    : {}
              }
              transition={{ duration: 0.45, ease: "easeInOut", delay: 0.03 }}
            >
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordPulse === "error") setPasswordPulse("idle");
                }}
                className={passwordFieldClass}
                placeholder="••••••"
              />
            </motion.div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50"
            >
              {loading ? "Đang cập nhật…" : "Đặt lại mật khẩu"}
            </button>
          </motion.form>
        ) : step === "otp" ? (
          <motion.form
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onSubmit={handleVerifyOtp}
            className="space-y-5"
          >
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Đã gửi mã tới email liên quan tới{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span>
            </p>
            <div className="space-y-2">
              <span className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Mã OTP (6 số)
              </span>
              <motion.div
                className="flex justify-center gap-1.5 sm:gap-2"
                onPaste={handleOtpPaste}
                animate={
                  otpPulse === "error"
                    ? { x: [0, -12, 12, -10, 10, -6, 6, 0] }
                    : otpPulse === "success"
                      ? { scale: [1, 1.03, 1] }
                      : { x: 0, scale: 1 }
                }
                transition={{ duration: otpPulse === "error" ? 0.5 : 0.4, ease: "easeInOut" }}
              >
                {Array.from({ length: OTP_LEN }, (_, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={otpBoxes[i] ?? ""}
                    onChange={(e) => handleOtpBoxChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={otpBoxClass()}
                    aria-label={`Chữ số ${i + 1}`}
                  />
                ))}
              </motion.div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50"
            >
              {loading ? "Đang xác thực…" : "Xác thực"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleResendOtp}
              className="w-full text-center text-sm font-medium text-zinc-600 underline-offset-4 hover:underline disabled:opacity-50 dark:text-zinc-400"
            >
              Gửi lại OTP
            </button>
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              Gửi lại mã sẽ hủy phiên xác thực cũ — bạn cần nhập OTP mới.
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="email"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onSubmit={handleSendOtp}
            className="space-y-5"
          >
            <motion.div
              className="space-y-1.5 text-left"
              animate={
                emailPulse === "error"
                  ? { x: [0, -10, 10, -8, 8, 0] }
                  : emailPulse === "success"
                    ? { scale: [1, 1.02, 1] }
                    : {}
              }
              transition={{ duration: 0.48, ease: "easeInOut" }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                Email đăng nhập
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailPulse !== "idle") setEmailPulse("idle");
                }}
                className={emailInputClass}
                placeholder="ban@congty.com"
              />
            </motion.div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-50"
            >
              {loading ? "Đang gửi…" : "Gửi OTP"}
            </button>
          </motion.form>
        )}

        {step !== "done" && (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/login"
              className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Quay lại đăng nhập
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
