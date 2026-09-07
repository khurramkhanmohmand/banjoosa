"use client";

import Link from "next/link";
import { Modal, CartLineItem, EmptyState, Button, formatPrice } from "@banjoosa/ui";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { priceCartLines, cartSubtotal } from "@/lib/cartPricing";

export function CartDrawer() {
  const { lines, cartOpen, closeCart, incrementLine, decrementLine } = useCart();
  const { items, deals } = useCatalog();
  const priced = priceCartLines(lines, items, deals);
  const subtotal = cartSubtotal(priced);

  return (
    <Modal open={cartOpen} onClose={closeCart} align="right">
      <div className="flex items-center justify-between px-5 py-5 bg-ink text-cream">
        <span className="font-display text-2xl text-brand-yellow">YOUR CART</span>
        <button type="button" onClick={closeCart} className="font-ui font-bold text-xl tracking-wide">
          CLOSE ✕
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 py-5 flex flex-col gap-3.5">
        {priced.length === 0 ? (
          <EmptyState title="Nothing here yet" description="Add something and it shows up." />
        ) : (
          priced.map((line) => (
            <CartLineItem
              key={line.lineKey}
              name={line.name}
              sub={line.sub}
              total={formatPrice(line.total)}
              qty={line.qty}
              onIncrement={() => incrementLine(line.lineKey)}
              onDecrement={() => decrementLine(line.lineKey)}
            />
          ))
        )}
      </div>

      <div className="border-t-4 border-ink px-5 py-5">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-ui font-bold uppercase tracking-wide text-xl">Subtotal</span>
          <span className="font-display text-2xl text-brand-red">{formatPrice(subtotal)}</span>
        </div>
        {priced.length === 0 ? (
          <Button variant="danger" fullWidth disabled>
            Go to checkout
          </Button>
        ) : (
          <Link href="/checkout" onClick={closeCart}>
            <Button variant="danger" fullWidth>
              Go to checkout
            </Button>
          </Link>
        )}
      </div>
    </Modal>
  );
}
