"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

interface UseSiteSettingsResult {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
}

/** Admin-editable site content — Home hero photo and promo ticker text. */
export function useSiteSettings(): UseSiteSettingsResult {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<SiteSettings>("/api/settings")
      .then((res) => {
        if (!cancelled) setSettings(res);
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

  return { settings, loading, error };
}
