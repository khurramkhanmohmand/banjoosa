import { io, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@banjoosa/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:4000";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

/** One shared socket connection for the admin app — the live dashboard joins branch:{id} on it. */
export function getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  if (!socket) {
    socket = io(SOCKET_URL, { withCredentials: true, autoConnect: true });
  }
  return socket;
}
