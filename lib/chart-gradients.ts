export function barGradientBluePurple(
  ctx: CanvasRenderingContext2D,
  chartArea: { top: number; bottom: number },
) {
  const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, "#3b82f6");
  g.addColorStop(0.55, "#6366f1");
  g.addColorStop(1, "#a855f7");
  return g;
}

export function barGradientBluePurpleHorizontal(
  ctx: CanvasRenderingContext2D,
  chartArea: { left: number; right: number },
) {
  const g = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
  g.addColorStop(0, "#3b82f6");
  g.addColorStop(0.55, "#6366f1");
  g.addColorStop(1, "#a855f7");
  return g;
}

export function lineFillGradientBluePurple(
  ctx: CanvasRenderingContext2D,
  chartArea: { top: number; bottom: number },
) {
  const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, "rgba(59, 130, 246, 0.08)");
  g.addColorStop(0.5, "rgba(139, 92, 246, 0.18)");
  g.addColorStop(1, "rgba(168, 85, 247, 0.28)");
  return g;
}

export function barGradientEmerald(
  ctx: CanvasRenderingContext2D,
  chartArea: { top: number; bottom: number },
) {
  const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  g.addColorStop(0, "#059669");
  g.addColorStop(1, "#34d399");
  return g;
}
