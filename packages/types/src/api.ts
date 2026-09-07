import type { AdminUser } from "./auth";
import type { CartItemType, DeliveryMode, Order, PaymentMethod } from "./order";

/** Single consistent error-response shape returned by every apps/api endpoint. */
export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export interface CreateOrderItemInput {
  itemType: CartItemType;
  itemId: string;
  variantId: string | null;
  addOnIds: string[];
  qty: number;
}

export interface CreateOrderRequest {
  branchId: string;
  customerName: string;
  customerPhone: string;
  deliveryMode: DeliveryMode;
  address: string | null;
  deliveryNote: string | null;
  pickupTime: string | null;
  paymentMethod: PaymentMethod;
  items: CreateOrderItemInput[];
}

export type CreateOrderResponse = Order;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

export interface UpdateOrderStatusRequest {
  status: Order["status"];
}

export interface ReportTopItem {
  name: string;
  qty: number;
  revenue: number;
}

export interface ReportSummary {
  rangeStart: string;
  rangeEnd: string;
  orderCount: number;
  totalRevenue: number;
  avgOrderValue: number;
  topItems: ReportTopItem[];
}
