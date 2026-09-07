"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@banjoosa/ui";
import {
  DELIVERY_FEE_RS,
  DELIVERY_ETA_MINUTES,
  DeliveryMode,
  FREE_DELIVERY_THRESHOLD_RS,
  PICKUP_ETA_MINUTES,
  PaymentMethod,
  TAX_RATE,
  type CreateOrderRequest,
  type Order,
} from "@banjoosa/types";
import { useCatalog } from "@/context/CatalogContext";
import { useCart } from "@/context/CartContext";
import { priceCartLines, cartSubtotal } from "@/lib/cartPricing";
import { apiFetch, ApiError } from "@/lib/apiClient";
import { DeliveryModeToggle } from "@/components/checkout/DeliveryModeToggle";
import { CheckoutFormFields, type CheckoutFormValues } from "@/components/checkout/CheckoutFormFields";
import { PaymentMethodPicker } from "@/components/checkout/PaymentMethodPicker";
import { OrderSummaryPanel } from "@/components/checkout/OrderSummaryPanel";

const EMPTY_FORM: CheckoutFormValues = { name: "", phone: "", address: "", deliveryNote: "", pickupTime: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, deals, branch } = useCatalog();
  const { lines, clearCart } = useCart();

  const [mode, setMode] = useState<DeliveryMode>(DeliveryMode.DELIVERY);
  const [payment, setPayment] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [form, setForm] = useState<CheckoutFormValues>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricedLines = priceCartLines(lines, items, deals);
  const subtotal = cartSubtotal(pricedLines);
  const isDelivery = mode === DeliveryMode.DELIVERY;
  const fee = isDelivery ? (subtotal >= FREE_DELIVERY_THRESHOLD_RS ? 0 : DELIVERY_FEE_RS) : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + fee + tax;
  const etaLabel = isDelivery ? `${DELIVERY_ETA_MINUTES} minutes` : `${PICKUP_ETA_MINUTES} minutes`;

  const handlePlaceOrder = async () => {
    if (!branch || pricedLines.length === 0) return;
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    if (isDelivery && !form.address.trim()) {
      setError("Address is required for delivery.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateOrderRequest = {
        branchId: branch.id,
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        deliveryMode: mode,
        address: isDelivery ? form.address.trim() : null,
        deliveryNote: isDelivery && form.deliveryNote.trim() ? form.deliveryNote.trim() : null,
        pickupTime: !isDelivery && form.pickupTime.trim() ? form.pickupTime.trim() : null,
        paymentMethod: payment,
        items: lines.map((l) => ({
          itemType: l.itemType,
          itemId: l.itemId,
          variantId: l.variantId,
          addOnIds: l.addOnIds,
          qty: l.qty,
        })),
      };
      const order = await apiFetch<Order>("/api/orders", { method: "POST", body: JSON.stringify(payload) });
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-11">
      <h1 className="font-display text-5xl text-brand-red mb-6">CHECKOUT</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card shadow="none" className="p-6 flex flex-col gap-4">
          <DeliveryModeToggle mode={mode} onChange={setMode} />
          <CheckoutFormFields mode={mode} branchName={branch?.name ?? ""} values={form} onChange={setForm} />
          <PaymentMethodPicker value={payment} onChange={setPayment} />
        </Card>

        <OrderSummaryPanel
          lines={pricedLines}
          subtotal={subtotal}
          fee={fee}
          feeLabel={isDelivery ? "Delivery" : "Pickup"}
          tax={tax}
          total={total}
          etaLabel={etaLabel}
          onPlaceOrder={handlePlaceOrder}
          submitting={submitting}
          error={error}
        />
      </div>
    </div>
  );
}
