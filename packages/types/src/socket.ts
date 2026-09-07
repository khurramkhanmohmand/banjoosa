import type { Order, OrderStatus } from "./order";

/**
 * Socket.io event name constants, shared by the api emitter and both
 * frontend subscribers so a typo can't silently desync a channel.
 * Naming convention: "<resource>:<action>", snake_case action.
 */
export const SocketEvent = {
  /** Client -> server: join the order:{orderId} room for live tracking. */
  SUBSCRIBE_ORDER: "order:subscribe",
  /** Client -> server: join the branch:{branchId} room (admin only, requires auth token in payload). */
  SUBSCRIBE_BRANCH: "branch:subscribe",
  /** Server -> branch room: a new order was placed. */
  ORDER_CREATED: "order:created",
  /** Server -> order room + branch room: status changed on an existing order. */
  ORDER_STATUS_CHANGED: "order:status_changed",
} as const;
export type SocketEvent = (typeof SocketEvent)[keyof typeof SocketEvent];

export const orderRoom = (orderId: string): string => `order:${orderId}`;
export const branchRoom = (branchId: string): string => `branch:${branchId}`;

export interface OrderStatusChangedPayload {
  orderId: string;
  status: OrderStatus;
  updatedAt: string;
}

export interface SubscribeOrderPayload {
  orderId: string;
}

export interface SubscribeBranchPayload {
  branchId: string;
  token: string;
}

/** Server -> client event payload map, used to type the Socket.io client/server generics. */
export interface ServerToClientEvents {
  [SocketEvent.ORDER_CREATED]: (order: Order) => void;
  [SocketEvent.ORDER_STATUS_CHANGED]: (payload: OrderStatusChangedPayload) => void;
}

export interface ClientToServerEvents {
  [SocketEvent.SUBSCRIBE_ORDER]: (payload: SubscribeOrderPayload) => void;
  [SocketEvent.SUBSCRIBE_BRANCH]: (payload: SubscribeBranchPayload) => void;
}
