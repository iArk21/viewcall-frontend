import { useState } from "react";
import { joinMeeting } from "../services/meetingService";
import { useNavigate } from "react-router-dom";

export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const [username, setUsername] = useState("");   // ← NOMBRE
  const navigate = useNavigate();

  async function handleJoin() {
    if (!meetingId.trim() || !username.trim()) {
      alert("Ingresa tu nombre y el ID de la reunión");
      return;
    }

    try {
      await joinMeeting(meetingId);

      // 👇 Enviamos el nombre al MeetingRoom
      navigate(`/meeting/${meetingId}`, { 
        state: { username } 
      });

      // Guardar en caso de refresh
      localStorage.setItem("userName", username);

    } catch (error) {
      console.error(error);
      alert("Unable to join meeting");
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl">Join Meeting</h1>

      {/* NOMBRE */}
      <input
        type="text"
        placeholder="Tu nombre"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded block mt-4"
      />

      {/* MEETING ID */}
      <input
        type="text"
        placeholder="Enter meeting ID"
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
        className="border p-2 rounded block mt-4"
      />

      <button
        onClick={handleJoin}
        className="bg-blue-600 text-white p-2 rounded mt-4"
      >
        Join
      </button>
    </main>
  );
}
