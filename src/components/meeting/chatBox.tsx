import { useState, useEffect } from "react";
import { socket } from "../../sockets/socket";

export default function ChatBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const handleMessage = (data: { text: string }) => {
      console.log("📩 Mensaje recibido:", data);
      setMessages((prev) => [...prev, data.text]);
    };
  
    socket.on("receiveMessage", handleMessage);
  
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);
  

  const sendMessage = () => {
    if (!msg.trim()) return;

    console.log("📤 Enviando mensaje:", msg);

    socket.emit("sendMessage", {
      roomId: "global",
      text: msg,
    });

    setMsg("");
  };

  return (
    <div className="chat-box p-4 bg-gray-800 rounded-lg text-white 
                    w-full max-w-md mx-auto 
                    flex flex-col 
                    h-[400px]"> {/* altura fija */}
      
      {/* Mensajes scrollables */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-3 rounded-lg mb-3">
        {messages.map((m, i) => (
          <p key={i} className="mb-1">{m}</p>
        ))}
      </div>

      {/* Input + botón abajo */}
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 outline-none"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
