"use client";

import { Modal, Pill, QtyStepper, Button, formatPrice } from "@banjoosa/ui";
import { useItemModal } from "@/context/ItemModalContext";

export function ItemDetailModal() {
  const {
    selectedItem: item,
    selectedVariantId,
    selectedAddOnIds,
    qty,
    close,
    selectVariant,
    toggleAddOn,
    incrementQty,
    decrementQty,
    confirmAdd,
  } = useItemModal();

  const variant = item?.hasVariants ? item.variants.find((v) => v.id === selectedVariantId) : undefined;
  const base = item?.hasVariants ? variant?.price ?? 0 : item?.basePrice ?? 0;
  const addOnSum = item ? item.addOns.filter((a) => selectedAddOnIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0) : 0;
  const total = (base + addOnSum) * qty;

  return (
    <Modal open={!!item} onClose={close} maxWidthClassName="max-w-[800px]">
      {item && (
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="min-h-[280px] relative bg-card border-r-0 sm:border-r-4 border-ink">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover absolute inset-0" />
          ) : (
            <div className="w-full h-full min-h-[280px] flex items-center justify-center text-meta font-ui uppercase text-sm">
              Photo coming soon
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col gap-3.5">
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="font-ui font-bold uppercase tracking-[0.14em] text-sm text-brand-red">{item.section}</div>
              <div className="font-display text-[28px] sm:text-3xl leading-tight">{item.name}</div>
            </div>
            <button type="button" onClick={close} aria-label="Close" className="font-ui font-bold text-xl">
              ✕
            </button>
          </div>

          <p className="text-base leading-relaxed text-body m-0">{item.longDescription}</p>

          {item.hasVariants && (
            <div>
              <div className="font-ui font-bold uppercase tracking-[0.12em] text-sm text-meta mb-2">
                {item.variantLabel ?? "Choose"}
              </div>
              <div className="flex gap-2 flex-wrap">
                {item.variants.map((v) => (
                  <Pill key={v.id} active={selectedVariantId === v.id} onClick={() => selectVariant(v.id)}>
                    {v.label} · {formatPrice(v.price)}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          {item.addOns.length > 0 && (
            <div>
              <div className="font-ui font-bold uppercase tracking-[0.12em] text-sm text-meta mb-2">Add on</div>
              <div className="flex gap-2 flex-wrap">
                {item.addOns.map((a) => (
                  <Pill key={a.id} active={selectedAddOnIds.includes(a.id)} onClick={() => toggleAddOn(a.id)}>
                    {a.name} +{a.price}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3.5 mt-1">
            <div className="font-display text-3xl text-brand-red">{formatPrice(total)}</div>
            <QtyStepper qty={qty} onIncrement={incrementQty} onDecrement={decrementQty} />
          </div>

          <Button variant="danger" fullWidth onClick={confirmAdd}>
            Add to cart
          </Button>
        </div>
      </div>
      )}
    </Modal>
  );
}
