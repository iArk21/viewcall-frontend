import { useState, useEffect } from "react";
import { socket } from "../../sockets/socket";

/**
 * ChatBox - Real time chat using sockets
 */
export default function ChatBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  function sendMessage() {
    socket.emit("chat_message", msg);
    setMsg("");
  }

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i}>{m}</p>
        ))}
      </div>

      <input value={msg} onChange={(e) => setMsg(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
