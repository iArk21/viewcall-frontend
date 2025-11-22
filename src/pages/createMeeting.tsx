import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar } from "lucide-react";

/**
 * CreateMeeting Component
 *
 * This component allows users to:
 * - Create a new meeting (generates a random UUID)
 * - Join an existing meeting by entering a code
 * - Navigate back to the home page
 *
 * The UI includes:
 * - App logo
 * - Meeting creation button
 * - Input field to join a meeting
 * - Visual icons representing call features
 *
 * @component
 */
export default function CreateMeeting() {
  /** React Router navigate function */
  const navigate = useNavigate();

  /** 
   * Stores the meeting code entered by the user.
   * @type {[string, Function]}
   */
  const [code, setCode] = useState("");

  /**
   * Handles the creation of a new meeting by generating a UUID.
   * Navigates the user to the generated meeting route.
   *
   * @function
   */
  const handleCreate = () => {
    const meetingId = crypto.randomUUID();
    navigate(`/meeting/${meetingId}`);
  };

  /**
   * Joins an existing meeting based on the code entered.
   * Prevents navigation if the code is empty.
   *
   * @function
   */
  const handleJoin = () => {
    if (!code.trim()) return;
    navigate(`/meeting/${code}`);
  };

  return (
    <main className="min-h-screen bg-[#E7ECFF] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/70 shadow-2xl rounded-3xl p-10 border border-gray-200">

        {/* Logo and Back button */}
        <div className="flex justify-between items-center mb-6">

          {/* Logo */}
          <div className="flex gap-2">
            <img src="/viewcall-logo.png" className="w-10" />
            <h1 className="text-2xl font-bold text-[#4169E1]">VIEWCALL</h1>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/home")}
            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Go back to sign in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

        </div>

        {/* Main title */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Videoconferencias seguras para todos
        </h2>
        <p className="text-gray-700 mb-8">
          Conecta, colabora y celebra desde cualquier lugar
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">

          {/* Create meeting */}
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#345CFF] hover:bg-[#2C4DDB] text-white px-5 py-3 rounded-xl font-medium"
          >
            <Video size={20} /> Nueva reunión
          </button>

          {/* Meeting code input */}
          <div className="flex items-center bg-white border border-gray-300 px-4 py-3 rounded-xl">
            <Calendar className="text-[#345CFF]" size={20} />
            <input
              className="ml-2 focus:outline-none"
              placeholder="Introducir código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {/* Join meeting */}
          <button
            onClick={handleJoin}
            className="bg-[#345CFF] text-white px-4 py-3 rounded-xl"
          >
            Unirse
          </button>
        </div>

        {/* Decorative icons */}
        <div className="bg-white w-full rounded-3xl shadow p-6 flex items-center justify-center gap-10">
          <div className="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center">
            👥
          </div>
          <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center">
            🎥
          </div>
          <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center">
            💬
          </div>
        </div>
      </div>
    </main>
  );
}
