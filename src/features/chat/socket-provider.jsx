"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/auth-context";
import { connectSocket, disconnectSocket, getSocket } from "./socket";

const SocketContext = createContext({ socket: null, isConnected: false, onlineUsers: new Set() });

/**
 * Owns the socket lifecycle and the app-wide events that are not tied to a
 * single screen: inbox previews, unread badges and presence. Per-thread events
 * (`message:new`, typing) are handled by `useConversation`, which knows which
 * conversation is on screen.
 */
export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(() => new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setIsConnected(false);
      return undefined;
    }

    const socket = connectSocket();
    if (!socket) return undefined;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onConversationUpdated = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.badges });
    };

    const onNotification = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.badges });
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    };

    const onOnline = ({ userId }) =>
      setOnlineUsers((previous) => new Set(previous).add(String(userId)));

    const onOffline = ({ userId }) =>
      setOnlineUsers((previous) => {
        const next = new Set(previous);
        next.delete(String(userId));
        return next;
      });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("conversation:updated", onConversationUpdated);
    socket.on("notification:new", onNotification);
    socket.on("presence:online", onOnline);
    socket.on("presence:offline", onOffline);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("conversation:updated", onConversationUpdated);
      socket.off("notification:new", onNotification);
      socket.off("presence:online", onOnline);
      socket.off("presence:offline", onOffline);
    };
  }, [isAuthenticated, user?.id, queryClient]);

  useEffect(() => () => disconnectSocket(), []);

  const value = useMemo(
    () => ({ socket: getSocket(), isConnected, onlineUsers }),
    [isConnected, onlineUsers]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
