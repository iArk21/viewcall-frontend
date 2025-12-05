import { useEffect, useState } from "react";
import {
  joinRoom,
  onExistingUsers,
  onUserJoined,
  onUserLeft,
  socket,
} from "../../services/chatSocket";

interface ParticipantsProps {
  roomId: string;
  username: string;
}

export default function ParticipantsPanel({ roomId, username }: ParticipantsProps) {
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const addSelf = () => {
      const selfUser = {
        socketId: socket.id!,
        userInfo: {
          userId: socket.id!,
          displayName: username,
        },
      };

      // Agregar al usuario local (React no conoce al usuario propio hasta que lo agregues)
      setParticipants((prev) => {
        const exists = prev.some((p) => p.socketId === selfUser.socketId);
        return exists ? prev : [...prev, selfUser];
      });

      // Unirse a la sala
      joinRoom(roomId, selfUser.userInfo);
    };

    if (socket.connected) {
      addSelf();
    } else {
      socket.once("connect", addSelf);
    }

    // --- LISTA INICIAL ---
    const unsubInitial = onExistingUsers((users) => {
      setParticipants((prev) => {
        const ids = new Set(prev.map((p) => p.socketId));
        const merged = [...prev];

        users.forEach((u) => {
          if (!ids.has(u.socketId)) merged.push(u);
        });

        return merged;
      });
    });

    // --- USUARIO ENTRA ---
    const unsubJoin = onUserJoined((data) => {
      setParticipants((prev) => {
        const exist = prev.some((p) => p.socketId === data.socketId);
        return exist ? prev : [...prev, data];
      });
    });

    // --- USUARIO SALE ---
    const unsubLeft = onUserLeft((data) => {
      setParticipants((prev) =>
        prev.filter((p) => p.socketId !== data.socketId)
      );
    });

    return () => {
      unsubInitial();
      unsubJoin();
      unsubLeft();
      socket.off("connect", addSelf);
    };
  }, [roomId, username]);

  return (
    <div className="bg-[#20242E] rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">Participantes</h2>

      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
        {participants.map((p) => (
          <div
            key={p.socketId}
            className="flex items-center gap-3 bg-[#161A21] p-3 rounded-lg"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              {p.userInfo.displayName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <p className="text-sm">{p.userInfo.displayName}</p>
          </div>
        ))}

        {participants.length === 0 && (
          <p className="text-sm opacity-70">No hay participantes todavía.</p>
        )}
      </div>
    </div>
  );
}
