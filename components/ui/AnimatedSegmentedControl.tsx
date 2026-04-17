"use client";

import { motion } from "framer-motion";

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type AnimatedSegmentedControlProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  layoutId: string;
  className?: string;
  size?: "sm" | "md";
};

export function AnimatedSegmentedControl<T extends string>({
  value,
  onChange,
  options,
  layoutId,
  className = "",
  size = "md",
}: AnimatedSegmentedControlProps<T>) {
  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : "px-4 py-2 text-sm";

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 rounded-2xl ${className}`.trim()}
    >
      {options.map((option) => {
        const active = value === option.value;

        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: option.disabled ? 1 : 0.985 }}
            onClick={() => {
              if (!option.disabled && option.value !== value) {
                onChange(option.value);
              }
            }}
            disabled={option.disabled}
            className={`relative overflow-hidden rounded-xl font-medium transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            } ${sizeClasses}`}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-emerald-500"
                transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.9 }}
              />
            ) : null}
            <span className="relative z-10">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
