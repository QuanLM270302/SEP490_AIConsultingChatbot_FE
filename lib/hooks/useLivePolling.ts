"use client";

import { useEffect, useRef } from "react";

type PollTask = () => void | Promise<void>;

interface UseLivePollingOptions {
  enabled?: boolean;
  intervalMs: number;
  hiddenIntervalMs?: number;
  runImmediately?: boolean;
  refreshOnFocus?: boolean;
  refreshOnVisible?: boolean;
  refreshOnPageShow?: boolean;
}

/**
 * Lightweight live polling with:
 * - immediate first tick
 * - focus/visibility/pageshow instant refresh
 * - no overlapping requests
 * - adaptive interval for hidden tabs
 */
export function useLivePolling(task: PollTask, options: UseLivePollingOptions): void {
  const {
    enabled = true,
    intervalMs,
    hiddenIntervalMs = intervalMs * 2,
    runImmediately = true,
    refreshOnFocus = true,
    refreshOnVisible = true,
    refreshOnPageShow = true,
  } = options;

  const taskRef = useRef<PollTask>(task);
  const runningRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const currentInterval = () =>
      document.visibilityState === "visible" ? intervalMs : hiddenIntervalMs;

    const schedule = () => {
      clearTimer();
      timerRef.current = window.setTimeout(() => {
        void tick();
      }, currentInterval());
    };

    const tick = async () => {
      if (cancelled || runningRef.current) {
        schedule();
        return;
      }
      runningRef.current = true;
      try {
        await taskRef.current();
      } finally {
        runningRef.current = false;
        if (!cancelled) schedule();
      }
    };

    const runSoon = () => {
      clearTimer();
      window.requestAnimationFrame(() => {
        void tick();
      });
    };

    if (runImmediately) {
      runSoon();
    } else {
      schedule();
    }

    const onFocus = () => runSoon();
    const onVisibility = () => {
      if (document.visibilityState === "visible") runSoon();
      else schedule();
    };
    const onPageShow = () => runSoon();

    if (refreshOnFocus) window.addEventListener("focus", onFocus);
    if (refreshOnVisible) document.addEventListener("visibilitychange", onVisibility);
    if (refreshOnPageShow) window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelled = true;
      clearTimer();
      if (refreshOnFocus) window.removeEventListener("focus", onFocus);
      if (refreshOnVisible) document.removeEventListener("visibilitychange", onVisibility);
      if (refreshOnPageShow) window.removeEventListener("pageshow", onPageShow);
    };
  }, [
    enabled,
    hiddenIntervalMs,
    intervalMs,
    refreshOnFocus,
    refreshOnPageShow,
    refreshOnVisible,
    runImmediately,
  ]);
}

