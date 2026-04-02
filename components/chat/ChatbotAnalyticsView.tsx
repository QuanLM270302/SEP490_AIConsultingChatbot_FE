"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { AIUsageChart } from "@/components/tenant-admin/AIUsageChart";
import { AIMetrics } from "@/components/tenant-admin/AIMetrics";
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

const FORBIDDEN_POLL_MS = 7_000;

export function ChatbotAnalyticsView() {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [llm, setLlm] = useState<TenantLlmUsageResponse | null>(null);
  const [docs, setDocs] = useState<TenantDocumentDashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (silent) setSyncing(true);
    else {
      setLoading(true);
      setPageError(null);
      setForbidden(false);
    }

    await tryRefreshAuth();
    try {
      const [llmData, docData] = await Promise.all([
        getTenantLlmUsage(),
        getTenantDocumentDashboardStats(),
      ]);
      setLlm(llmData);
      setDocs(docData);
      setPageError(null);
      setForbidden(false);
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      setLlm(null);
      setDocs(null);
      setPageError(parseApiErrorMessage(raw));
      setForbidden(apiErrorLooksForbidden(raw));
    } finally {
      if (silent) setSyncing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!forbidden || !pageError) return;
    const id = window.setInterval(() => {
      void load({ silent: true });
    }, FORBIDDEN_POLL_MS);
    return () => window.clearInterval(id);
  }, [forbidden, pageError, load]);

  return (
    <div className="scrollbar-chat-hidden h-full overflow-y-auto scroll-smooth bg-zinc-950">
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{t.aiAnalytics}</h1>
            <p className="mt-1 text-sm text-zinc-400">{t.aiPerformanceDescription}</p>
            <p className="mt-1 text-xs text-zinc-500">{t.analyticsDataNote}</p>
          </div>
          <Link
            href="/tenant-admin/analytics"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-white/10"
          >
            {language === "en" ? "Full dashboard" : "Bảng điều khiển đầy đủ"}
            <ExternalLink className="h-4 w-4" />
          </Link>
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
                  {forbidden ? (
                    <p className="mt-2 text-xs text-zinc-500">
                      {language === "en" ? "Detail: " : "Chi tiết: "}
                      <span className="text-zinc-400">{pageError}</span>
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                <button
                  type="button"
                  onClick={() => void load()}
                  disabled={loading}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
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
                {syncing ? (
                  <span className="inline-flex items-center justify-center gap-1.5 text-xs text-amber-200/90">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    {t.analyticsSyncing}
                  </span>
                ) : null}
              </div>
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
    </div>
  );
}
