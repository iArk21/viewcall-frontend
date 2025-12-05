import { useState } from "react";
import { Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../services/Firebaseapi"; //

import { getAuthToken } from '../services/authToken';


export default function CreateMeeting() {
  const [ ] = useState(() => getAuthToken() ?? '');
  const [meetingName, setMeetingName] = useState("");
  const [generatedCode, ] = useState<string | null>(null);

  const navigate = useNavigate();

const handleCreateMeeting = async () => {
  if (!meetingName) {
    alert("Completa todos los campos.");
    return;
  }

  try {
    const meetingData = {
      title: meetingName,
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
          className="absolute top-5 left-5 p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition cursor-pointer"
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

          {/* Crear reunión */}
          <button
            onClick={handleCreateMeeting}
            className="w-full py-3 mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition cursor-pointer"
          >
            Crear Reunión
          </button>

          {/* Código generado */}
          {generatedCode && (
            <div className="mt-4 text-center text-black bg-gray-100 rounded-lg p-3 font-semibold shadow-md cursor-pointer">
              Código de reunión: <span>{generatedCode}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
