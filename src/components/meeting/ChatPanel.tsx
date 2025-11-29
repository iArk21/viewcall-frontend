import { SendHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { socket } from "../../sockets/socket";

interface ChatPanelProps {
  roomId: string;
  username: string;
}

interface Message {
  text: string;
  senderName: string;
}


export default function ChatPanel({ roomId, username }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- JOIN ROOM ---
  useEffect(() => {
    socket.emit("joinRoom", { roomId, username });

    const onHistory = (payload: any) => {
      if (payload.roomId === roomId) {
        setMessages(payload.messages || []);
      }
    };

    const onReceive = (msg: any) => {
      console.log("MSG RECIBIDO:", msg);

      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("roomHistory", onHistory);
    socket.on("receiveMessage", (msg) => {
      console.log("Mensaje recibido:", msg);
      setMessages((prev) => [...prev, msg]);
    });


    return () => {
      socket.emit("leaveRoom", { roomId, username });
      socket.off("roomHistory", onHistory);
      socket.off("receiveMessage", onReceive);
    };
  }, [roomId, username]);

  // Auto-scroll
  useEffect(() => scrollToBottom(), [messages]);

  // --- SEND MESSAGE ---
  const send = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      text: input,
      // NO enviar senderName, el backend lo ignora
    });

    setInput("");
  };

  return (
    <div className="flex-1 bg-[#20242E] rounded-xl p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 bg-[#1B1F29] p-2 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-[#161A21] p-3 rounded-lg text-sm text-gray-300"
          >
            <strong>
            {msg.senderName}</strong>{msg.text}
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
        <button onClick={send} className="bg-blue-600 p-2 rounded-lg">
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
}
