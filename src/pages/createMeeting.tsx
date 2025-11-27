/**
 * CreateMeeting Page
 *
 * Página para crear una nueva reunión:
 * - Permite seleccionar fecha, hora y título.
 * - Genera un código único de reunión.
 * - Compatible con integración futura a backend/Firestore.
 */
import { useState } from "react";
import { CalendarDays, Users, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function CreateMeeting() {
  const [meetingName, setMeetingName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  // ⬇️ CORRECCIÓN IMPORTANTE
  const [participants, setParticipants] = useState<string[]>([]);

  const navigate = useNavigate();

  const [newParticipant, setNewParticipant] = useState("");

  // Generar código de reunión simple (luego lo cambiamos a UUID)
  const generateMeetingCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return;

    // Agregar participante como string
    setParticipants([...participants, newParticipant]);
    setNewParticipant("");
  };

  const handleCreateMeeting = () => {
    if (!meetingName || !meetingDate || !meetingTime) {
      alert("Completa todos los campos.");
      return;
    }
  
    const meetingCode = generateMeetingCode();
  
    const meetingData = {
      name: meetingName,
      date: meetingDate,
      time: meetingTime,
      participants,
      code: meetingCode,
      createdAt: new Date(),
    };
  
    console.log("Reunión creada:", meetingData);
  
    navigate(`/meeting/${meetingCode}`);
  };
  

  return (
    <main className="min-h-screen flex justify-center py-10 px-4 bg-gradient-to-b from-[#101010] to-[#1a1a1a] text-white">
      <div className="w-full max-w-lg bg-black/60 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Crear nueva reunión
        </h1>

        {/* Nombre de la reunión */}
        <label className="block mb-4">
          <span className="flex items-center gap-2 text-sm mb-1">
            <Users size={18} /> Nombre de la reunión
          </span>
          <input
            type="text"
            placeholder="Ej: Reunión del equipo"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            className="w-full p-2 rounded bg-black/40 border border-white/20"
          />
        </label>

        {/* Fecha */}
        <label className="block mb-4">
          <span className="flex items-center gap-2 text-sm mb-1">
            <CalendarDays size={18} /> Fecha
          </span>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="w-full p-2 rounded bg-black/40 border border-white/20"
          />
        </label>

        {/* Hora */}
        <label className="block mb-4">
          <span className="flex items-center gap-2 text-sm mb-1">
            <Clock size={18} /> Hora
          </span>
          <input
            type="time"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            className="w-full p-2 rounded bg-black/40 border border-white/20"
          />
        </label>

        {/* Participantes */}
        <div className="mb-4">
          <span className="flex items-center gap-2 text-sm mb-1">
            <Users size={18} /> Participantes
          </span>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Correo del participante"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              className="flex-1 p-2 rounded bg-black/40 border border-white/20"
            />
            <button
              onClick={handleAddParticipant}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              <Plus size={20} />
            </button>
          </div>

          {participants.length > 0 && (
            <ul className="mt-3 text-sm opacity-80 space-y-1">
              {participants.map((p, idx) => (
                <li key={idx}>• {p}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Botón Crear */}
        <button
          onClick={handleCreateMeeting}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-medium"
        >
          Crear reunión
        </button>
      </div>
    </main>
  );
}
