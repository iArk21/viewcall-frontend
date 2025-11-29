import { useState } from "react";
import { CalendarDays, Users, Clock, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateMeeting() {
  const [meetingName, setMeetingName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const navigate = useNavigate();

  const generateMeetingCode = () => crypto.randomUUID().slice(0, 8).toUpperCase();

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return;
    setParticipants([...participants, newParticipant]);
    setNewParticipant("");
  };

  const handleCreateMeeting = async () => {
    if (!meetingName || !meetingDate || !meetingTime) {
      alert("Completa todos los campos.");
      return;
    }

    const meetingCode = generateMeetingCode();
    setGeneratedCode(meetingCode);

    const dateIso = new Date(`${meetingDate}T${meetingTime}`).toISOString();

    const meetingData = {
      meetingId: meetingCode,
      name: meetingName,
      date: dateIso,
      participants,
      createdAt: new Date().toISOString(),
    };

    try {
      const base = import.meta.env.VITE_CHAT_URL;

      const res = await fetch(`${base}/api/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetingData),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error creando reunión:", txt);
        alert("Error creando reunión en el servidor.");
        return;
      }

      const payload = await res.json();
      console.log("Reunión creada (server):", payload);

      setTimeout(() => {
        navigate(`/meeting/${meetingCode}`);
      }, 700);
    } catch (err) {
      console.error("Error network:", err);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef2ff] to-[#e3e8ff] p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl px-10 py-12 border border-gray-100 relative">
        
        {/* Botón de volver */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-extrabold text-black text-center">
            Crear Reunión
          </h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Completa los datos para crear tu reunión
          </p>
        </div>

        {/* Formulario */}
        <div className="space-y-5">
          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <Users size={18} /> Nombre de la reunión
            </label>
            <input
              type="text"
              placeholder="Ej: Reunión del equipo"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <CalendarDays size={18} /> Fecha
            </label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hora */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <Clock size={18} /> Hora
            </label>
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Participantes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <Users size={18} /> Participantes
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Correo del participante"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddParticipant}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
              >
                <Plus size={20} />
              </button>
            </div>
            {participants.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {participants.map((p, idx) => (
                  <li key={idx}>• {p}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Crear reunión */}
          <button
            onClick={handleCreateMeeting}
            className="w-full py-3 mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Crear Reunión
          </button>

          {/* Código generado */}
          {generatedCode && (
            <div className="mt-4 text-center text-black bg-gray-100 rounded-lg p-3 font-semibold shadow-md">
              Código de reunión: <span>{generatedCode}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
