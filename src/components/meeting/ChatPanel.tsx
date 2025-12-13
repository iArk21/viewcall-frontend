import { SendHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  connectSocket,
  disconnectSocket,
  joinRoom,
  sendChatMessage,
  onChatMessage,
} from "../../services/chatSocket";

interface ChatPanelProps {
  roomId: string;
  username: string;
  onClose?: () => void;
}

interface Message {
  text: string;
  senderName: string;
  timestamp: number;
}

export default function ChatPanel({ roomId, username, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // CONNECT SOCKET
    connectSocket();

    // JOIN ROOM (usando tu API real)
    joinRoom(roomId, {
      userId: crypto.randomUUID(),
      displayName: username,
      photoURL: ""
    });

    //LISTEN CHAT MESSAGES
    const unsubscribeChat = onChatMessage((msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [
          ...prev,
          {
            text: msg.message,
            senderName: msg.userName,
            timestamp: msg.timestamp
          }
        ]);
      }
    });

    return () => {
      // DISCONNECT
      disconnectSocket();
      unsubscribeChat();
    };
  }, [roomId, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SEND MESSAGE
  const send = () => {
    if (!input.trim()) return;

    sendChatMessage({
      roomId,
      userName: username,
      message: input,
      timestamp: Date.now()
    });

    setInput("");
  };

  return (
    <div className="flex-1 bg-[#20242E] rounded-xl p-4 flex flex-col min-h-0 h-full">
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h2 className="text-lg font-semibold">Chat</h2>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 bg-[#1B1F29] p-2 rounded-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent min-h-0">
        {messages.map((msg, index) => (
          <div key={index} className="bg-[#161A21] p-3 rounded-lg text-sm text-gray-300">
            <strong>{msg.senderName}</strong>: {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Escribe un mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#161A21] px-3 py-2 rounded-lg"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="bg-blue-600 p-2 rounded-lg cursor-pointer">
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
}
