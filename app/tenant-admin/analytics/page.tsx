"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { TenantAdminLayout } from "@/components/tenant-admin/TenantAdminLayout";
import { AIMetrics } from "@/components/tenant-admin/AIMetrics";
import { AIUsageChart } from "@/components/tenant-admin/AIUsageChart";
import { DocumentEmbeddingOverview } from "@/components/tenant-admin/DocumentEmbeddingOverview";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/translations";
import {
  getTenantLlmUsage,
  getTenantDocumentDashboardStats,
  type TenantLlmUsageResponse,
  type TenantDocumentDashboardStatsResponse,
} from "@/lib/api/tenant-admin";
import { tryRefreshAuth } from "@/lib/auth-store";
import { apiErrorLooksForbidden, parseApiErrorMessage } from "@/lib/api/parseApiError";

export default function AnalyticsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [llm, setLlm] = useState<TenantLlmUsageResponse | null>(null);
  const [docs, setDocs] = useState<TenantDocumentDashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    setForbidden(false);
    await tryRefreshAuth();
    try {
      const [llmData, docData] = await Promise.all([
        getTenantLlmUsage(),
        getTenantDocumentDashboardStats(),
      ]);
      setLlm(llmData);
      setDocs(docData);
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      setLlm(null);
      setDocs(null);
      setPageError(parseApiErrorMessage(raw));
      setForbidden(apiErrorLooksForbidden(raw));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{t.aiAnalytics}</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t.aiPerformanceDescription}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{t.analyticsDataNote}</p>
        </div>

        {pageError ? (
          <div
            className={`rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 ${
              forbidden
                ? "border-amber-500/35 bg-amber-950/25 text-amber-100/95"
                : "border-red-500/35 bg-red-950/30 text-red-100/95"
            }`}
            role="alert"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    forbidden ? "bg-amber-500/15 text-amber-300" : "bg-red-500/15 text-red-300"
                  }`}
                >
                  <ShieldAlert className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {forbidden
                      ? language === "en"
                        ? "Cannot load analytics yet"
                        : "Chưa thể tải phân tích"
                      : language === "en"
                        ? "Could not load analytics"
                        : "Không tải được phân tích"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed opacity-95">
                    {forbidden ? t.analyticsAccessDeniedHint : pageError}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void load()}
                disabled={loading}
                className={`inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                  forbidden
                    ? "bg-amber-600 text-white hover:bg-amber-500"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <RefreshCw className="h-4 w-4" aria-hidden />
                )}
                {t.analyticsRetryLoad}
              </button>
            </div>
          </div>
        ) : null}

        {!pageError ? (
          <>
            <AIMetrics data={llm} loading={loading} error={null} />
            <AIUsageChart data={llm} loading={loading} error={null} />
            <DocumentEmbeddingOverview data={docs} loading={loading} error={null} />
          </>
        ) : null}
      </div>
    </TenantAdminLayout>
  );
}
