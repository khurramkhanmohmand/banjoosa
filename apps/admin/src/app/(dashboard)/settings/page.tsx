"use client";

import { useEffect, useState } from "react";
import { Button, Card, ImageUploadField, Spinner, Textarea, useToast } from "@banjoosa/ui";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { uploadImage } from "@/lib/uploadImage";

export default function SettingsPage() {
  const { settings, loading, error, saveSettings } = useAdminSettings();
  const { showToast } = useToast();

  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [tickerText, setTickerText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Seed local form state once the real settings arrive — a plain effect
  // (not derived state) because this only needs to happen once per load,
  // not on every settings re-fetch after a save.
  useEffect(() => {
    if (settings) {
      setHeroImageUrl(settings.heroImageUrl);
      setTickerText(settings.tickerText);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaveError(null);
    if (!tickerText.trim()) {
      setSaveError("Ticker text can't be empty.");
      return;
    }
    setSaving(true);
    try {
      await saveSettings({ heroImageUrl, tickerText: tickerText.trim() });
      showToast("Site settings saved");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-brand-red mb-6">SITE SETTINGS</h1>

      {loading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <p className="text-brand-red">{error}</p>}

      {!loading && !error && (
        <Card shadow="sticker-soft" className="p-6 flex flex-col gap-5 max-w-[560px]">
          <ImageUploadField
            label="Home page hero photo"
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            onUploadFile={uploadImage}
          />
          <Textarea
            label="Promo ticker text (scrolling yellow strip on Home)"
            value={tickerText}
            onChange={(e) => setTickerText(e.target.value)}
          />

          {saveError && <p className="text-brand-red text-sm m-0">{saveError}</p>}

          <Button variant="danger" onClick={handleSave} disabled={saving} className="self-start">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </Card>
      )}
    </div>
  );
}
