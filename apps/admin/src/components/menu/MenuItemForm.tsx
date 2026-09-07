"use client";

import { useState } from "react";
import { Button, Card, Input, Pill, Select, Textarea } from "@banjoosa/ui";
import { useSections } from "@/hooks/useSections";
import { useAddOns } from "@/hooks/useAddOns";
import type { MenuItemFormInput, MenuItemVariantInput } from "@/hooks/useAdminMenuItems";

interface MenuItemFormProps {
  initial: MenuItemFormInput;
  submitLabel: string;
  onSubmit: (input: MenuItemFormInput) => Promise<void>;
}

const EMPTY_VARIANT: MenuItemVariantInput = { label: "", price: 0 };

export function MenuItemForm({ initial, submitLabel, onSubmit }: MenuItemFormProps) {
  const { sections } = useSections();
  const { addOns } = useAddOns();

  const [form, setForm] = useState<MenuItemFormInput>(initial);
  const [pricingMode, setPricingMode] = useState<"flat" | "variants">(initial.variants.length > 0 ? "variants" : "flat");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof MenuItemFormInput>(key: K, value: MenuItemFormInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateVariant = (index: number, patch: Partial<MenuItemVariantInput>) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  };

  const addVariantRow = () => setForm((prev) => ({ ...prev, variants: [...prev.variants, { ...EMPTY_VARIANT }] }));
  const removeVariantRow = (index: number) =>
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));

  const toggleAddOn = (id: string) =>
    setForm((prev) => ({
      ...prev,
      addOnIds: prev.addOnIds.includes(id) ? prev.addOnIds.filter((x) => x !== id) : [...prev.addOnIds, id],
    }));

  const handleSubmit = async () => {
    setError(null);
    if (!form.sectionId) {
      setError("Choose a section.");
      return;
    }
    if (pricingMode === "flat" && (form.basePrice === null || form.basePrice < 0)) {
      setError("Enter a base price.");
      return;
    }
    if (pricingMode === "variants" && form.variants.some((v) => !v.label.trim() || v.price < 0)) {
      setError("Every variant needs a label and a price.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        basePrice: pricingMode === "flat" ? form.basePrice : null,
        variants: pricingMode === "variants" ? form.variants : [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this item.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card shadow="sticker-soft" className="p-6 flex flex-col gap-4 max-w-[640px]">
      <Select
        label="Section"
        value={form.sectionId}
        onChange={(e) => set("sectionId", e.target.value)}
        options={[{ value: "", label: "Select a section" }, ...sections.map((s) => ({ value: s.id, label: s.name }))]}
      />
      <Input label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      <Input label="Tag (optional)" value={form.tag ?? ""} onChange={(e) => set("tag", e.target.value || null)} />
      <Input label="Short description" value={form.description} onChange={(e) => set("description", e.target.value)} />
      <Textarea
        label="Long description"
        value={form.longDescription}
        onChange={(e) => set("longDescription", e.target.value)}
      />
      <Input
        label="Image path (optional)"
        placeholder="/menu/pizza.png"
        value={form.imageUrl ?? ""}
        onChange={(e) => set("imageUrl", e.target.value || null)}
      />

      <div>
        <div className="font-ui font-bold uppercase tracking-wide text-sm text-meta mb-2">Pricing</div>
        <div className="flex gap-2 mb-3">
          <Pill active={pricingMode === "flat"} onClick={() => setPricingMode("flat")}>
            Single price
          </Pill>
          <Pill active={pricingMode === "variants"} onClick={() => setPricingMode("variants")}>
            Variants (size/bread)
          </Pill>
        </div>

        {pricingMode === "flat" ? (
          <Input
            label="Price (Rs)"
            type="number"
            value={form.basePrice ?? ""}
            onChange={(e) => set("basePrice", e.target.value === "" ? null : Number(e.target.value))}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <Input
              label="Variant label (e.g. Size, Bread style)"
              value={form.variantLabel ?? ""}
              onChange={(e) => set("variantLabel", e.target.value || null)}
            />
            {form.variants.map((variant, i) => (
              <div key={i} className="flex gap-2 items-end">
                <Input
                  label={`Option ${i + 1}`}
                  value={variant.label}
                  onChange={(e) => updateVariant(i, { label: e.target.value })}
                />
                <Input
                  label="Price (Rs)"
                  type="number"
                  value={variant.price}
                  onChange={(e) => updateVariant(i, { price: Number(e.target.value) })}
                />
                <Button variant="outline" size="sm" onClick={() => removeVariantRow(i)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={addVariantRow} className="self-start">
              Add option
            </Button>
          </div>
        )}
      </div>

      <div>
        <div className="font-ui font-bold uppercase tracking-wide text-sm text-meta mb-2">Add-ons</div>
        <div className="flex gap-2 flex-wrap">
          {addOns.map((a) => (
            <Pill key={a.id} active={form.addOnIds.includes(a.id)} onClick={() => toggleAddOn(a.id)}>
              {a.name} +{a.price}
            </Pill>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 font-ui font-semibold text-sm">
        <input
          type="checkbox"
          checked={form.isAvailable}
          onChange={(e) => set("isAvailable", e.target.checked)}
        />
        Available on the customer menu
      </label>

      {error && <p className="text-brand-red text-sm m-0">{error}</p>}

      <Button variant="danger" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </Card>
  );
}
