"use client";

import { twMerge } from "tailwind-merge";

const LOGO_URL =
  "https://res.cloudinary.com/dhaltx1cv/image/upload/v1776434033/oquwr1kvc0b4vmwemnsz.png";

interface AppLogoProps {
  size?: number;
  className?: string;
  imageClassName?: string;
  alt?: string;
}

export function AppLogo({
  size = 36,
  className = "",
  imageClassName = "",
  alt = "Internal Consultant AI logo",
}: AppLogoProps) {
  return (
    <span
      className={twMerge(
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/85 p-1 shadow-md shadow-emerald-500/10 ring-1 ring-zinc-200/70 backdrop-blur dark:border-zinc-700/70 dark:bg-zinc-900/80 dark:ring-zinc-700/60",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src={LOGO_URL}
        alt={alt}
        className={twMerge("h-full w-full rounded-lg object-contain", imageClassName)}
        loading="lazy"
      />
    </span>
  );
}

