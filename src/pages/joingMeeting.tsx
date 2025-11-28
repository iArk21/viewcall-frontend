import { useState } from "react";
import { joinMeeting } from "../services/meetingService";
import { useNavigate } from "react-router-dom";

export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  async function handleJoin() {
    if (!meetingId.trim()) {
      alert("Enter a meeting ID");
      return;
    }

    try {
      await joinMeeting(meetingId); 
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error(error);
      alert("Unable to join meeting");
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl">Join Meeting</h1>

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
