"use client";

import { io } from "socket.io-client";
import { getStoredToken, API_BASE_URL } from "@/lib/api-client";

/**
 * One shared Socket.io connection for the tab.
 *
 * The socket must never be created at module scope: it would open during SSR
 * and again on every fast-refresh. Instead the provider calls `connectSocket()`
 * once the user is known, and `disconnectSocket()` on sign-out.
 */

let socket = null;

/** The socket server lives at the API origin, not under the `/api` path. */
const socketOrigin = () => API_BASE_URL.replace(/\/api\/?$/, "");

export const getSocket = () => socket;

export function connectSocket() {
  if (socket?.connected) return socket;

  const token = getStoredToken();
  if (!token) return null;

  socket = io(socketOrigin(), {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnectionAttempts: 6,
    reconnectionDelay: 800,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

/** Promise wrapper over a socket ack, so callers can `await` an emit. */
export const emitWithAck = (event, payload) =>
  new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error("Not connected"));
      return;
    }
    socket.timeout(8000).emit(event, payload, (timeoutError, response) => {
      if (timeoutError) return reject(timeoutError);
      if (!response?.ok) return reject(new Error(response?.error || "Request failed"));
      return resolve(response);
    });
  });
