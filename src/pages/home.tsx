import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar } from "lucide-react";
import { useState } from "react";

/**
 * Home Page Component
 * 
 * This component represents the landing page of the application.
 * It displays navigation, a hero section, quick-action buttons,
 * and a footer. Users can create a meeting or enter a meeting code.
 *
 * @component
 * @returns {JSX.Element} The rendered Home page UI.
 */
export default function Home() {
  /**
   * Meeting code state
   * @type {[string, Function]}
   * 
   * Stores user input when typing a meeting code in the hero section.
   */
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-[#eef1ff]">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center mt-12 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 drop-shadow">
          Videoconferencias seguras para todos
        </h1>

        <p className="text-gray-600 mt-2 text-lg">
          Conecta, colabora y celebra desde cualquier lugar
        </p>

        {/* TOP ACTION BUTTONS */}
        <div className="flex gap-4 mt-6">
          {/* Create New Meeting Button */}
          <Link
            to="/create-meeting"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow"
          >
            📹 Nueva reunión
          </Link>

          {/* Input to Join Meeting with Code */}
          <div className="flex items-center bg-white border border-gray-300 px-4 py-3 rounded-xl">
            <Calendar className="text-[#345CFF]" size={20} />

            {/**
             * Meeting code input
             *
             * @input Allows users to type a meeting code.
             * @controlled Controlled by the `code` state.
             */}
            <input
              className="ml-2 focus:outline-none"
              placeholder="Introducir código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>

        {/* MAIN ICON BUTTONS */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mt-10 flex gap-6">
          {/**
           * Participant Icon Button
           * Represents user or group-related action.
           */}
          <button className="bg-yellow-400 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl shadow">
            👥
          </button>

          {/**
           * Video Icon Button
           * Represents video-call actions.
           */}
          <button className="bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl shadow">
            🎥
          </button>

          {/**
           * Chat Icon Button
           * Represents messaging or communication features.
           */}
          <button className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl shadow">
            💬
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
