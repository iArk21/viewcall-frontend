// src/sockets/socket.ts
import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4002";

export interface ServerToClientEvents {
  receiveMessage: (msg: any) => void;
  roomHistory: (data: { roomId: string; messages: any[] }) => void;
  presence: (payload: { user: any; action: string }) => void;
  typing: (payload: { user: any; isTyping: boolean }) => void;
  participants: (list: any[]) => void;
  meetingEnded: (payload: any) => void;
}

export interface ClientToServerEvents {
  sendMessage: (msg: any) => void;
  joinRoom: (data: any) => void;
  leaveRoom: (data: any) => void;
  typing: (data: any) => void;
  auth: (payload: any) => void;
  getRoomUsers: (roomId: string, cb: (data: any) => void) => void;
  endMeeting: (payload: any) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  transports: ["websocket"],
});
