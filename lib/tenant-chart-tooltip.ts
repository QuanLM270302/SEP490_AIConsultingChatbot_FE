import type { TooltipOptions } from "chart.js";

export function tenantLegendLabels(isDark: boolean) {
  return {
    color: isDark ? "#a1a1aa" : "#52525b",
    padding: 14,
    usePointStyle: true,
    pointStyle: "circle",
    font: { size: 12, family: "inherit" },
  };
}

export function tenantTooltipBase(isDark: boolean): Partial<TooltipOptions<"bar" | "doughnut">> {
  return {
    backgroundColor: isDark ? "#18181b" : "#fafafa",
    titleColor: isDark ? "#fafafa" : "#18181b",
    bodyColor: isDark ? "#d4d4d8" : "#3f3f46",
    borderColor: isDark ? "rgba(168, 85, 247, 0.35)" : "rgba(99, 102, 241, 0.35)",
    borderWidth: 1,
    cornerRadius: 12,
    padding: 12,
    displayColors: true,
    boxPadding: 6,
  };
}
