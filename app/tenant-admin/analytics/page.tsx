"use client";

import { useEffect, useState } from "react";
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

export default function AnalyticsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [llm, setLlm] = useState<TenantLlmUsageResponse | null>(null);
  const [docs, setDocs] = useState<TenantDocumentDashboardStatsResponse | null>(null);
  const [llmLoading, setLlmLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(true);
  const [llmError, setLlmError] = useState<string | null>(null);
  const [docsError, setDocsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLlmLoading(true);
    setDocsLoading(true);
    setLlmError(null);
    setDocsError(null);

    getTenantLlmUsage()
      .then((data) => {
        if (!cancelled) {
          setLlm(data);
          setLlmError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLlm(null);
          setLlmError(e instanceof Error ? e.message : "Error");
        }
      })
      .finally(() => {
        if (!cancelled) setLlmLoading(false);
      });

    getTenantDocumentDashboardStats()
      .then((data) => {
        if (!cancelled) {
          setDocs(data);
          setDocsError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setDocs(null);
          setDocsError(e instanceof Error ? e.message : "Error");
        }
      })
      .finally(() => {
        if (!cancelled) setDocsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <TenantAdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{t.aiAnalytics}</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t.aiPerformanceDescription}</p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{t.analyticsDataNote}</p>
        </div>

        <AIMetrics data={llm} loading={llmLoading} error={llmError} />
        <AIUsageChart data={llm} loading={llmLoading} error={llmError} />
        <DocumentEmbeddingOverview data={docs} loading={docsLoading} error={docsError} />
      </div>
    </TenantAdminLayout>
  );
}
