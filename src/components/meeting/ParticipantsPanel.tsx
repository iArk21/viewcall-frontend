import { useEffect, useState } from "react";
import { socket } from "../../sockets/socket";

interface ParticipantsProps {
  roomId: string;
  username: string;
}

interface User {
  id: string;
  name: string;
}

export default function ParticipantsPanel({
  roomId,
  username,
}: ParticipantsProps) {
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    socket.emit("joinRoom", { roomId, username });

    socket.emit("getRoomUsers", roomId, (res: any) => {
      setParticipants(res?.users || []);
    });

    const onList = (list: User[]) => {
      setParticipants(list || []);
    };

    socket.on("participants", onList);

    return () => {
      socket.emit("leaveRoom", { roomId, username });
      socket.off("participants", onList);
    };
  }, [roomId, username]);

  return (
    <div className="bg-[#20242E] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Participantes</h2>

      <div className="flex flex-col gap-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 bg-[#161A21] p-3 rounded-lg"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              {p.name?.[0] ?? "U"}
            </div>
            <p className="text-sm">{p.name}</p>
          </div>
        ))}

        {participants.length === 0 && (
          <p className="text-sm opacity-70">No hay participantes todavía.</p>
        )}
      </div>
    </div>
  );
}
