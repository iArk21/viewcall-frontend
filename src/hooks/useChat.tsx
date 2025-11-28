import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

// Tipos opcionales
interface ChatMessage {
  text: string;
  user?: any;
  meta?: any;
  createdAt?: string;
}

interface TypingUser {
  id: string;
  name?: string;
}

export default function useChat({
  backendUrl = import.meta.env.VITE_CHAT_BACKEND_URL || "http://localhost:4002",
  token = null,
  roomId = null,
}: {
  backendUrl?: string;
  token?: string | null;
  roomId?: string | null;
}) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [usersInRoom, setUsersInRoom] = useState<any[]>([]);

  // CREAMOS el socket dinámicamente según backendUrl
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // ----------------------
    // Crear el socket CORRECTO
    // ----------------------
    const s = io(backendUrl, {
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });

    socketRef.current = s;

    // ----------------------
    // Handlers
    // ----------------------
    const onConnect = () => {
      setConnected(true);
      if (roomId) s.emit("joinRoom", { roomId });
    };

    const onDisconnect = () => setConnected(false);

    const onReceive = (msg: ChatMessage) =>
      setMessages((prev) => [...prev, msg]);

    const onRoomHistory = ({ messages: hist }: { messages: ChatMessage[] }) =>
      setMessages(hist || []);

    const onTyping = ({
      user,
      isTyping,
    }: {
      user: TypingUser;
      isTyping: boolean;
    }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (!prev.find((u) => u.id === user.id)) return [...prev, user];
          return prev;
        } else {
          return prev.filter((u) => u.id !== user.id);
        }
      });
    };

    const onPresence = () => {};

    // ----------------------
    // Registrar eventos
    // ----------------------
    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("receiveMessage", onReceive);
    s.on("roomHistory", onRoomHistory);
    s.on("typing", onTyping);
    s.on("presence", onPresence);

    // ----------------------
    // Cleanup al desmontar o cambiar URL/token/roomId
    // ----------------------
    return () => {
      if (roomId) s.emit("leaveRoom", { roomId });

      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("receiveMessage", onReceive);
      s.off("roomHistory", onRoomHistory);
      s.off("typing", onTyping);
      s.off("presence", onPresence);

      s.disconnect();
    };
  }, [backendUrl, token, roomId]);

  // -----------------------
  // Enviar mensaje
  // -----------------------
  const sendMessage = (text: string, meta = {}, recipientId: string | null = null) => {
    if (!text.trim()) return;
    socketRef.current?.emit("sendMessage", { roomId, text, meta, recipientId });
  };

  // -----------------------
  // Escribiendo
  // -----------------------
  const sendTyping = (isTyping = true) => {
    socketRef.current?.emit("typing", { roomId, isTyping });
  };

  // -----------------------
  // Historial REST
  // -----------------------
  const fetchHistoryREST = async ({ limit = 50, before = null } = {}) => {
    try {
      const res = await axios.get(`${backendUrl}/api/chat/rooms/${roomId}/messages`, {
        params: { limit, before },
        headers: token ? { Authorization: token } : {},
      });

      setMessages(res.data.messages || []);
      return res.data;
    } catch (e) {
      console.error("fetchHistoryREST error", e);
      return null;
    }
  };

  // -----------------------
  // Usuarios en sala
  // -----------------------
  const getRoomUsers = () => {
    return new Promise((resolve) => {
      socketRef.current?.emit("getRoomUsers", roomId, (res: any) => {
        setUsersInRoom(res?.users || []);
        resolve(res?.users || []);
      });
    });
  };

  return {
    connected,
    messages,
    typingUsers,
    usersInRoom,
    sendMessage,
    sendTyping,
    fetchHistoryREST,
    getRoomUsers,
  };
}
