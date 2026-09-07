"use client";

import { useCallback, useEffect, useState } from "react";
import type { SiteSettings, UpdateSiteSettingsRequest } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

export function useAdminSettings(): {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  saveSettings: (input: UpdateSiteSettingsRequest) => Promise<SiteSettings>;
} {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    return apiFetch<SiteSettings>("/api/settings")
      .then(setSettings)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveSettings = useCallback(async (input: UpdateSiteSettingsRequest) => {
    const updated = await apiFetch<SiteSettings>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(input),
    });
    setSettings(updated);
    return updated;
  }, []);

  return { settings, loading, error, saveSettings };
}
