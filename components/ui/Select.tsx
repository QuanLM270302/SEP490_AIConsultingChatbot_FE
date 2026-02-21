import { cn } from "@/lib/utils/cn";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.name}
            className="block text-sm font-medium text-zinc-900 dark:text-white"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="mt-2">
          <select
            ref={ref}
            className={cn(
              "block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm transition-colors",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500",
              "dark:border-zinc-700 dark:bg-zinc-800 dark:text-white",
              "dark:focus:border-blue-500 dark:disabled:bg-zinc-900",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          >
            {children}
          </select>
        </div>
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {helperText}
          </p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
