import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#eef1ff]">
              <Navbar />


      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-12 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 drop-shadow">
          Videoconferencias seguras para todos
        </h1>

        <p className="text-gray-600 mt-2 text-lg">
          Conecta, colabora y celebra desde cualquier lugar
        </p>

        {/* BOTONES SUPERIORES */}
        <div className="flex gap-4 mt-6">
          <Link
            to="/create-meeting"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow"
          >
            📹 Nueva reunión
          </Link>

          <Link
            to="/meetings/join"
            className="flex items-center gap-2 bg-white text-blue-600 border px-5 py-3 rounded-xl font-semibold shadow"
          >
            📅 Introducir código
          </Link>
        </div>

        {/* ICONOS GRANDES */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mt-10 flex gap-6">
          <button className="bg-yellow-400 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl shadow">
            👥
          </button>

          <button className="bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl shadow">
            🎥
          </button>

          <button className="bg-green-500 w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl shadow">
            💬
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-white py-8 shadow-inner">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">

          {/* MAPA DEL SITIO */}
          <div>
            <h2 className="font-bold text-lg">Mapa del sitio</h2>
            <div className="border rounded p-4 mt-2">
            </div>
          </div>

          {/* SOBRE NOSOTROS */}
          <div>
            <h2 className="font-bold text-lg">Sobre nosotros</h2>
            <p className="mt-2 text-gray-600">
              ViewCall es una plataforma diseñada para facilitar videollamadas
              rápidas, seguras y accesibles para cualquier persona.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
