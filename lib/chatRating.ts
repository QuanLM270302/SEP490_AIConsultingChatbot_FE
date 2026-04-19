/**
 * Backend stores 1–5 stars on assistant messages; the UI uses thumbs up/down.
 */
export function mapServerRatingToUi(
  rating: unknown
): "helpful" | "not-helpful" | undefined {
  if (rating == null) return undefined;
  const n = typeof rating === "number" ? rating : Number(rating);
  if (!Number.isFinite(n)) return undefined;
  if (n >= 4) return "helpful";
  if (n <= 2) return "not-helpful";
  return undefined;
}
