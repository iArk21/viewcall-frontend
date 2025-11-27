import React from "react";

interface Participant {
  id: string;
  name: string;
}

interface Props {
  participants: Participant[];
}

const Participants: React.FC<Props> = ({ participants }) => {
  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-2">Participants</h2>

      {participants.length === 0 ? (
        <p>No hay participantes aún...</p>
      ) : (
        participants.map((p) => (
          <div key={p.id} className="py-1">
            {p.name}
          </div>
        ))
      )}
    </div>
  );
};

export default Participants;
