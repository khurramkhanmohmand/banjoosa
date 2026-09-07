"use client";

import { useState } from "react";
import { Button, Card, ImageUploadField, Input, Textarea } from "@banjoosa/ui";
import type { DealFormInput } from "@/hooks/useAdminDeals";
import { uploadImage } from "@/lib/uploadImage";

interface DealFormProps {
  initial: DealFormInput;
  submitLabel: string;
  onSubmit: (input: DealFormInput) => Promise<void>;
}

export function DealForm({ initial, submitLabel, onSubmit }: DealFormProps) {
  const [form, setForm] = useState<DealFormInput>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof DealFormInput>(key: K, value: DealFormInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this deal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card shadow="sticker-soft" className="p-6 flex flex-col gap-4 max-w-[560px]">
      <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      <Input label="Short description" value={form.description} onChange={(e) => set("description", e.target.value)} />
      <Textarea label="Long description" value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} />
      <ImageUploadField
        label="Photo"
        value={form.imageUrl}
        onChange={(url) => set("imageUrl", url)}
        onUploadFile={uploadImage}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Price (Rs)" type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
        <Input
          label="Was price (Rs)"
          type="number"
          value={form.wasPrice}
          onChange={(e) => set("wasPrice", Number(e.target.value))}
        />
      </div>
      <label className="flex items-center gap-2 font-ui font-semibold text-sm">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
        Active on the customer site
      </label>

      {error && <p className="text-brand-red text-sm m-0">{error}</p>}

      <Button variant="danger" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </Card>
  );
}
