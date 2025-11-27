import { SendHorizontal } from "lucide-react";
import { useState } from "react";

export default function ChatPanel() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, input]);
    setInput("");
  };

  return (
    <div className="flex-1 bg-[#20242E] rounded-xl p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Chat</h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className="bg-[#161A21] p-3 rounded-lg text-sm text-gray-300">
            Tú: {msg}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Escribe un mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#161A21] px-3 py-2 rounded-lg"
        />
        <button onClick={send} className="bg-blue-600 p-2 rounded-lg">
          <SendHorizontal />
        </button>
      </div>
    </div>
  );
}
