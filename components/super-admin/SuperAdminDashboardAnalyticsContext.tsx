"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EMPTY_PARSED_PLATFORM_DASHBOARD,
  fetchPlatformDashboard,
  parsePlatformDashboardJson,
  type ParsedPlatformDashboard,
} from "@/lib/api/platform-dashboard";

type SuperAdminDashboardAnalyticsValue = {
  parsed: ParsedPlatformDashboard;
  loading: boolean;
  error: boolean;
  refetch: () => void;
};

const SuperAdminDashboardAnalyticsContext =
  createContext<SuperAdminDashboardAnalyticsValue | null>(null);

export function SuperAdminDashboardAnalyticsProvider({ children }: { children: ReactNode }) {
  const [parsed, setParsed] = useState<ParsedPlatformDashboard>(EMPTY_PARSED_PLATFORM_DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    void fetchPlatformDashboard(false).then(({ ok, status, data }) => {
      if (!ok) {
        setParsed(EMPTY_PARSED_PLATFORM_DASHBOARD);
        if (status === 401) console.error("Dashboard analytics unauthorized (401)");
        else if (status === 403) console.error("Dashboard analytics forbidden (403)");
        else if (status >= 500) console.error("Dashboard analytics server error (5xx)");
        setError(true);
      } else {
        setParsed(parsePlatformDashboardJson(false, data));
        setError(false);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({ parsed, loading, error, refetch: load }),
    [parsed, loading, error, load]
  );

  return (
    <SuperAdminDashboardAnalyticsContext.Provider value={value}>
      {children}
    </SuperAdminDashboardAnalyticsContext.Provider>
  );
}

export function useSuperAdminDashboardAnalytics(): SuperAdminDashboardAnalyticsValue {
  const ctx = useContext(SuperAdminDashboardAnalyticsContext);
  if (!ctx) {
    throw new Error(
      "useSuperAdminDashboardAnalytics must be used within SuperAdminDashboardAnalyticsProvider"
    );
  }
  return ctx;
}
