/**
 * Business-rule constants shared by the API (authoritative pricing in
 * order.service.ts) and the web app (live cart/checkout preview before the
 * order is actually placed). Single source so the preview a customer sees
 * never drifts from what they're actually charged.
 */
export const DELIVERY_FEE_RS = 120;
export const FREE_DELIVERY_THRESHOLD_RS = 2000;
export const TAX_RATE = 0.05;
export const DELIVERY_ETA_MINUTES = 25;
export const PICKUP_ETA_MINUTES = 20;
export const ORDER_NUMBER_PREFIX = "BJ";
