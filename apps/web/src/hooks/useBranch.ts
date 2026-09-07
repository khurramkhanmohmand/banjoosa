"use client";

import { useEffect, useState } from "react";
import type { Branch } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

interface UseBranchResult {
  branch: Branch | null;
  loading: boolean;
  error: string | null;
}

/** The single operating branch — used by checkout to know which branchId to order against. */
export function useBranch(): UseBranchResult {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Branch>("/api/branch")
      .then((res) => {
        if (!cancelled) setBranch(res);
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
  }, []);

  return { branch, loading, error };
}
