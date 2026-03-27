"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AlertTone = "error" | "success" | "info";

type AlertState = {
  id: number;
  message: string;
  tone: AlertTone;
};

function detectTone(message: string): AlertTone {
  const text = message.toLowerCase();
  if (
    text.includes("thành công") ||
    text.includes("success") ||
    text.includes("đã gửi")
  ) {
    return "success";
  }
  if (
    text.includes("lỗi") ||
    text.includes("thất bại") ||
    text.includes("failed") ||
    text.includes("error") ||
    text.includes("không thể")
  ) {
    return "error";
  }
  return "info";
}

const toneStyles: Record<
  AlertTone,
  { ring: string; icon: React.ReactNode; title: string }
> = {
  error: {
    ring: "ring-red-500/40",
    icon: <AlertCircle className="h-5 w-5 text-red-400" />,
    title: "Có lỗi xảy ra",
  },
  success: {
    ring: "ring-emerald-500/40",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    title: "Thành công",
  },
  info: {
    ring: "ring-sky-500/40",
    icon: <Info className="h-5 w-5 text-sky-400" />,
    title: "Thông báo",
  },
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const originalAlert = window.alert.bind(window);

    window.alert = (message?: string) => {
      const normalizedMessage =
        typeof message === "string" ? message : String(message ?? "");
      setAlertState({
        id: Date.now(),
        message: normalizedMessage,
        tone: detectTone(normalizedMessage),
      });
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  useEffect(() => {
    if (!alertState) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setAlertState((current) =>
        current?.id === alertState.id ? null : current
      );
    }, 5500);
    return () => window.clearTimeout(timeout);
  }, [alertState]);

  const toneMeta = useMemo(
    () => (alertState ? toneStyles[alertState.tone] : null),
    [alertState]
  );

  return (
    <>
      {children}

      <AnimatePresence>
        {alertState && toneMeta && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAlertState(null)}
            />

            <motion.div
              className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-[#111827]/90 p-5 text-white shadow-2xl ring-1 ${toneMeta.ring}`}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="absolute right-3 top-3 rounded-full p-1.5 text-gray-300 transition hover:bg-white/10 hover:text-white"
                onClick={() => setAlertState(null)}
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-3 flex items-center gap-2">
                {toneMeta.icon}
                <p className="text-sm font-semibold tracking-wide">{toneMeta.title}</p>
              </div>

              <p className="text-sm leading-relaxed text-gray-100">
                {alertState.message}
              </p>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  className="rounded-full border border-emerald-300/70 bg-emerald-300/20 px-6 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/35"
                  onClick={() => setAlertState(null)}
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

