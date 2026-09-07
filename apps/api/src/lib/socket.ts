import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import {
  SocketEvent,
  branchRoom,
  orderRoom,
  type ClientToServerEvents,
  type ServerToClientEvents,
  type Order,
  type OrderStatusChangedPayload,
} from "@banjoosa/types";
import { env } from "../config/env";
import { verifyAdminToken } from "./jwt";

let io: Server<ClientToServerEvents, ServerToClientEvents> | null = null;

/**
 * Wires up the Socket.io server. Rooms are the whole model:
 * - `order:{orderId}` — a customer's tracking page joins this to receive
 *   status updates for that one order.
 * - `branch:{branchId}` — the admin dashboard joins this to receive every
 *   new order and status change for the branch, live.
 */
export function initSocket(httpServer: HttpServer): Server<ClientToServerEvents, ServerToClientEvents> {
  io = new Server(httpServer, {
    cors: { origin: env.corsOrigins, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.on(SocketEvent.SUBSCRIBE_ORDER, ({ orderId }) => {
      if (typeof orderId === "string" && orderId) {
        socket.join(orderRoom(orderId));
      }
    });

    socket.on(SocketEvent.SUBSCRIBE_BRANCH, ({ branchId, token }) => {
      try {
        verifyAdminToken(token);
      } catch {
        return;
      }
      if (typeof branchId === "string" && branchId) {
        socket.join(branchRoom(branchId));
      }
    });
  });

  return io;
}

function getIo(): Server<ClientToServerEvents, ServerToClientEvents> {
  if (!io) throw new Error("Socket.io server accessed before initSocket() ran");
  return io;
}

export function emitOrderCreated(order: Order): void {
  getIo().to(branchRoom(order.branchId)).emit(SocketEvent.ORDER_CREATED, order);
}

export function emitOrderStatusChanged(branchId: string, payload: OrderStatusChangedPayload): void {
  getIo().to(branchRoom(branchId)).to(orderRoom(payload.orderId)).emit(SocketEvent.ORDER_STATUS_CHANGED, payload);
}
