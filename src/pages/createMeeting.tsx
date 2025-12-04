import { useState } from "react";
import { CalendarDays, Users, Clock, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../services/Firebaseapi"; //

import { getAuthToken } from '../services/authToken';


export default function CreateMeeting() {
  const [ ] = useState(() => getAuthToken() ?? '');
  const [meetingName, setMeetingName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [generatedCode, ] = useState<string | null>(null);

  const navigate = useNavigate();

const handleCreateMeeting = async () => {
  if (!meetingName || !meetingDate || !meetingTime) {
    alert("Completa todos los campos.");
    return;
  }

  try {
    const meetingData = {
      title: meetingName,
      date: meetingDate,
      time: meetingTime,
    };

    // ÚNICA petición: usa tu API helper
    const res = await createMeeting(meetingData);

    console.log("Meeting created:", res);

    const meetingId = res.meeting.id;

    navigate(`/meeting/${meetingId}`);

  } catch (err) {
    console.error("Error al crear reunión:", err);
    alert("No se pudo crear la reunión.");
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef2ff] to-[#e3e8ff] p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl px-10 py-12 border border-gray-100 relative">

        {/* Botón de volver */}
        <button
          onClick={() => navigate("/home")}
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
                
                onChange={(e) => (e.target.value)}
                className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
              >
                <Plus size={20} />
              </button>
            
            </div>
            {/*
            {participants.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {participants.map((p, idx) => (
                  <li key={idx}>• {p}</li>
                ))}
              </ul>
            )}*/}
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
