import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4002";

// --- Tipos de eventos ---

export interface ServerToClientEvents {
  receiveMessage: (msg: any) => void;
  roomHistory: (data: { roomId: string; messages: any[] }) => void;
  presence: (payload: { user: any; action: string }) => void;
  typing: (payload: { user: any; isTyping: boolean }) => void;
  auth_ok: (data: { user: any }) => void;
  auth_fail: () => void;
}

export interface ClientToServerEvents {
  sendMessage: (msg: {
    roomId?: string;
    text: string;
    meta?: any;
    recipientId?: string;
  }) => void;
  joinRoom: (data: { roomId: string }) => void;
  leaveRoom: (data: { roomId: string }) => void;
  typing: (data: { roomId?: string; isTyping?: boolean }) => void;
  auth: (payload: { token: string }) => void;
  getRoomUsers: (roomId: string, cb: (data: any) => void) => void;
}

// --- Crear socket tipado ---
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  transports: ["websocket"],
});
