/**
 * Named constants instead of raw strings, per project coding rules —
 * access as OrderStatus.PREPARING rather than the literal "preparing".
 * Values must stay in sync with the Postgres enum in apps/api/prisma/schema.prisma.
 */
export const OrderStatus = {
  PLACED: "PLACED",
  PREPARING: "PREPARING",
  READY: "READY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/** Ordered for progress-bar style status UI. */
export const ORDER_STATUS_SEQUENCE: readonly OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.COMPLETED,
];

export const DeliveryMode = {
  DELIVERY: "DELIVERY",
  PICKUP: "PICKUP",
} as const;
export type DeliveryMode = (typeof DeliveryMode)[keyof typeof DeliveryMode];

export const PaymentMethod = {
  CARD: "CARD",
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  WALLET: "WALLET",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const CartItemType = {
  MENU_ITEM: "MENU_ITEM",
  DEAL: "DEAL",
} as const;
export type CartItemType = (typeof CartItemType)[keyof typeof CartItemType];

/**
 * A single line in the customer's cart, kept client-side until checkout.
 * Line identity = itemId + variantId + sorted add-on ids, so the same
 * burger with different add-ons becomes separate lines (per handoff).
 */
export interface CartLine {
  lineKey: string;
  itemType: CartItemType;
  itemId: string;
  variantId: string | null;
  addOnIds: string[];
  qty: number;
}

/** A priced, named snapshot of a cart line as it was at order time. */
export interface OrderLineItem {
  id: string;
  itemType: CartItemType;
  refId: string;
  name: string;
  variantLabel: string | null;
  addOnLabels: string[];
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  branchId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryMode: DeliveryMode;
  address: string | null;
  deliveryNote: string | null;
  pickupTime: string | null;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderLineItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  etaMinutes: number;
  createdAt: string;
  updatedAt: string;
}
