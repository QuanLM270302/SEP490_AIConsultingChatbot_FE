/** CustomEvent name: sidebar refetches platform dashboard stats (orgs total / pending). */
export const STAFF_PORTAL_STATS_REFRESH_EVENT = "staff-portal-stats-refresh";

export function requestStaffPortalStatsRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STAFF_PORTAL_STATS_REFRESH_EVENT));
}
