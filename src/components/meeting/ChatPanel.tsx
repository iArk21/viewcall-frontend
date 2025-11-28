import { SendHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { socket } from "../../sockets/socket";

interface Message {
  text: string;
  senderName?: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // --- Recibir mensajes del backend ---
    socket.on("receiveMessage", (msg) => {
      console.log("📩 Mensaje recibido:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;

    const msgObj = {
      roomId: "global",
      text: input,
    };

    // Enviar al backend
    socket.emit("sendMessage", msgObj);

    // También mostrar en UI inmediatamente
    setMessages((prev) => [...prev, { text: input, senderName: "Tú" }]);
    setInput("");
  };

  return (
    <div className="flex-1 bg-[#20242E] rounded-xl p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Chat</h2>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 bg-[#1B1F29] p-2 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-[#161A21] p-3 rounded-lg text-sm text-gray-300"
          >
            {msg.senderName ? `${msg.senderName}: ` : ""} {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
