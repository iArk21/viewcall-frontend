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

export default function ParticipantsPanel({
  roomId,
  username,
}: ParticipantsProps) {
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

      setParticipants((prev) => {
        const exists = prev.some((p) => p.socketId === selfUser.socketId);
        return exists ? prev : [...prev, selfUser];
      });

      joinRoom(roomId, selfUser.userInfo);
    };

    if (socket.connected) {
      addSelf();
    } else {
      socket.once("connect", addSelf);
    }

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

    const unsubJoin = onUserJoined((data) => {
      setParticipants((prev) => {
        const exist = prev.some((p) => p.socketId === data.socketId);
        return exist ? prev : [...prev, data];
      });
    });

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
    <section
      className="bg-[#20242E] rounded-xl p-4 h-full flex flex-col min-h-0"
      role="region"
      aria-label="Panel de participantes de la sala"
    >
      {/* Título */}
      <h2
        className="text-lg font-semibold mb-3 text-white"
        id="participants-title"
      >
        Participantes
      </h2>

      {/* Lista */}
      <div
        className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1 min-h-0"
        role="list"
        aria-live="polite"
        aria-relevant="additions removals"
        aria-labelledby="participants-title"
      >
        {participants.map((p) => (
          <div
            key={p.socketId}
            role="listitem"
            aria-label={`Participante ${p.userInfo.displayName}`}
            className="flex items-center gap-3 bg-[#161A21] p-3 rounded-lg"
          >
            {/* Avatar decorativo */}
            <div
              className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
              {p.userInfo.displayName?.[0]?.toUpperCase() ?? "U"}
            </div>

            <p className="text-sm text-white">
              {p.userInfo.displayName}
            </p>
          </div>
        ))}

        {participants.length === 0 && (
          <p
            className="text-sm opacity-70 text-white"
            role="status"
            aria-label="No hay participantes en la sala"
          >
            No hay participantes todavía.
          </p>
        )}
      </div>
    </section>
  );
}
