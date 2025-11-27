import { useState } from "react";
import { joinMeeting } from "../services/meetingService";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

/**
 * JoinMeeting Page
 * Allows the user to enter a meeting ID.
 */
export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  // Extraemos el usuario del store
  const { user } = useAuthStore();

  async function handleJoin() {
    if (!user) {
      alert("You must be logged in to join a meeting.");
      return;
    }

    try {
      await joinMeeting(meetingId, user.uid); // ahora es seguro
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error(error);
      alert("Unable to join meeting");
    }
  }

  return (
    <main>
      <h1>Join Meeting</h1>

      <input
        type="text"
        placeholder="Enter meeting ID"
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
      />

      <button onClick={handleJoin}>Join</button>
    </main>
  );
}
