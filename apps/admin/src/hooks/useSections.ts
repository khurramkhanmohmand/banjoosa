"use client";

import { useEffect, useState } from "react";
import type { MenuSection } from "@banjoosa/types";
import { apiFetch } from "@/lib/apiClient";

export function useSections(): { sections: MenuSection[]; loading: boolean } {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ sections: MenuSection[] }>("/api/admin/sections")
      .then((res) => setSections(res.sections))
      .finally(() => setLoading(false));
  }, []);

  return { sections, loading };
}
