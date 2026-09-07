/** Named constants instead of magic strings scattered across auth code. */
export const ADMIN_COOKIE_NAME = "banjoosa_admin_token";

// Pricing/ETA rules live in @banjoosa/types so the web app's checkout
// preview can never drift from what order.service.ts actually charges.
export {
  DELIVERY_FEE_RS,
  FREE_DELIVERY_THRESHOLD_RS,
  TAX_RATE,
  DELIVERY_ETA_MINUTES,
  PICKUP_ETA_MINUTES,
  ORDER_NUMBER_PREFIX,
} from "@banjoosa/types";
