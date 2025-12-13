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

export default function ChatPanel({
  roomId,
  username,
  onClose,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    connectSocket();

    joinRoom(roomId, {
      userId: crypto.randomUUID(),
      displayName: username,
      photoURL: "",
    });

    const unsubscribeChat = onChatMessage((msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [
          ...prev,
          {
            text: msg.message,
            senderName: msg.userName,
            timestamp: msg.timestamp,
          },
        ]);
      }
    });

    return () => {
      disconnectSocket();
      unsubscribeChat();
    };
  }, [roomId, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;

    sendChatMessage({
      roomId,
      userName: username,
      message: input,
      timestamp: Date.now(),
    });

    setInput("");
  };

  return (
    <section
      className="flex-1 bg-[#20242E] rounded-xl p-4 flex flex-col h-full min-h-0"
      role="region"
      aria-label="Panel de chat de la sala"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-3 flex-shrink-0">
        <h2
          className="text-lg font-semibold text-white"
          id="chat-title"
        >
          Chat
        </h2>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full text-white"
            aria-label="Cerrar panel de chat"
          >
            ✕
          </button>
        )}
      </header>

      {/* Lista de mensajes */}
      <div
        className="flex-1 min-h-0 max-h-full overflow-y-auto space-y-3 pr-2 bg-[#1B1F29] p-2 rounded-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-thumb-rounded"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Lista de mensajes del chat"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            role="article"
            aria-label={`Mensaje de ${msg.senderName}`}
            className="bg-[#161A21] p-3 rounded-lg text-sm text-gray-300"
          >
            <strong className="text-white">{msg.senderName}</strong>:{" "}
            {msg.text}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        className="flex items-center gap-2 mt-4 flex-shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        aria-label="Formulario para enviar mensajes"
      >
        <input
          type="text"
          placeholder="Escribe un mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#161A21] px-3 py-2 rounded-lg text-white outline-none"
          aria-label="Campo de texto para escribir mensaje"
        />

        <button
          type="submit"
          className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          aria-label="Enviar mensaje al chat"
        >
          <SendHorizontal className="text-white" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
