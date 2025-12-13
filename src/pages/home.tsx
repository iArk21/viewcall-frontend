import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { getMeeting } from "../services/Firebaseapi";

export default function Home() {
  const [code, setCode] = useState("");

  return (
    <div
      className="flex flex-col min-h-screen bg-[#eef1ff]"
      role="document"
      aria-label="Página principal de ViewCall"
    >
      {/* NAVBAR */}
      <header role="banner">
        <Navbar />
      </header>

      {/* MAIN */}
      <main
        role="main"
        aria-labelledby="home-title"
        className="flex-1"
      >
        {/* HERO SECTION */}
        <section
          className="flex flex-col items-center text-center mt-12 px-4"
          aria-labelledby="home-title"
        >
          <h1
            id="home-title"
            className="text-3xl md:text-4xl font-extrabold text-gray-800 drop-shadow"
          >
            Videoconferencias seguras para todos
          </h1>

          {/* JOIN MEETING */}
          <div
            className="flex flex-col md:flex-row items-center gap-4 mt-6"
            role="form"
            aria-label="Formulario para unirse a una reunión"
          >
            <div className="flex items-center bg-white border border-gray-300 px-4 py-3 rounded-xl shadow">
              <Calendar
                className="text-[#345CFF]"
                size={20}
                aria-hidden="true"
              />

              {/* LABEL OCULTO PARA ACCESIBILIDAD */}
              <label htmlFor="meeting-code" className="sr-only">
                Código de la reunión
              </label>

              <input
                id="meeting-code"
                className="ml-2 focus:outline-none bg-transparent"
                placeholder="Introducir código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-required="true"
                aria-label="Introducir código de reunión"
              />

              <button
                onClick={async () => {
                  if (!code.trim()) {
                    alert("Ingresa un código de reunión");
                    return;
                  }
                  try {
                    const res = await getMeeting(code);
                    if (!res) {
                      alert("El código no existe. Verifica e inténtalo de nuevo.");
                      return;
                    }
                    window.location.href = `/meeting/${code}`;
                  } catch (error) {
                    console.error("Error verificando reunión:", error);
                    alert("No se pudo verificar el código con el servidor.");
                  }
                }}
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
                aria-label="Unirse a la reunión usando el código ingresado"
              >
                Unirse
              </button>
            </div>
          </div>

          {/* HERO IMAGE */}
          <section
            className="mt-14 w-full max-w-4xl relative rounded-3xl overflow-hidden shadow-xl"
            aria-label="Sección promocional de ViewCall"
          >
            <img
              src="https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=1400&q=80"
              alt="Personas participando en una videoconferencia"
              className="w-full h-80 object-cover brightness-75"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-4xl font-bold drop-shadow">
                Conecta. Comparte. Colabora.
              </h2>

              <p className="mt-3 max-w-xl text-lg drop-shadow">
                La nueva forma inteligente de comunicarte con tu equipo y amigos.
              </p>

              <Link to="/create-meeting" aria-label="Ir a crear una nueva reunión">
                <button
                  className="mt-6 bg-blue-600 px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition cursor-pointer"
                  aria-label="Crear una nueva reunión"
                >
                  Iniciar reunión
                </button>
              </Link>
            </div>
          </section>
        </section>
      </main>

      {/* FOOTER */}
      <footer role="contentinfo">
        <Footer />
      </footer>
    </div>
  );
}
