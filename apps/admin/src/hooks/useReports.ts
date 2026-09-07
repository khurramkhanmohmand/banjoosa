"use client";

import { useEffect, useState } from "react";
import type { ReportSummary } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

export type ReportRange = "today" | "week" | "month";

export function useReports(range: ReportRange): { summary: ReportSummary | null; loading: boolean; error: string | null } {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch<ReportSummary>(`/api/admin/reports?range=${range}`)
      .then((res) => {
        if (!cancelled) setSummary(res);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return { summary, loading, error };
}
