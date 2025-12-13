import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * About component
 *
 * Página informativa del proyecto ViewCall.
 * Cumple WCAG 2.1 (Perceptible, Operable y Comprensible).
 */
const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#131820] text-white"
      role="document"
      aria-label="Página informativa del proyecto ViewCall"
    >
      {/* HEADER */}
      <header
        className="bg-[#20242E]/90 border-b border-white/10"
        role="banner"
        aria-label="Encabezado de la página Sobre ViewCall"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors mr-4 cursor-pointer"
            aria-label="Volver a la página anterior"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-2xl font-bold">Sobre ViewCall</h1>
        </div>
      </header>

      {/* MAIN */}
      <main
        className="max-w-4xl mx-auto px-4 py-12"
        role="main"
        aria-label="Contenido principal sobre el proyecto"
      >
        {/* LOGO */}
        <div className="text-center mb-12">
          <img
            src="/viewcall-logo.png"
            alt="Logotipo oficial del proyecto ViewCall"
            className="w-32 h-32 mx-auto mb-6 rounded-xl"
          />

          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            ViewCall
          </h2>

          <p className="text-xl text-gray-300">
            Conectando personas con una experiencia moderna de videollamadas.
          </p>
        </div>

        {/* PROYECTO ACADEMICO */}
        <section
          className="bg-[#20242E] rounded-2xl p-8 mb-8 border border-white/10"
          aria-labelledby="academic-title"
        >
          <h3 id="academic-title" className="text-2xl font-bold mb-4 text-blue-400">
            Proyecto Académico
          </h3>

          <p className="text-gray-300 leading-relaxed mb-4">
            ViewCall es una plataforma desarrollada por estudiantes de la{" "}
            <span className="text-blue-400 font-semibold">
              Universidad del Valle — Sede Yumbo
            </span>{" "}
            como parte del curso{" "}
            <span className="text-blue-400 font-semibold">
              Proyecto Integrador 1
            </span>.
          </p>

          <p className="text-gray-300 leading-relaxed">
            El proyecto aplica conceptos de desarrollo web moderno, experiencia de
            usuario y accesibilidad digital.
          </p>
        </section>

        {/* EQUIPO */}
        <section
          className="bg-[#20242E] rounded-2xl p-8 mb-8 border border-white/10"
          aria-labelledby="team-title"
        >
          <h3 id="team-title" className="text-2xl font-bold mb-6 text-blue-400 text-center">
            Nuestro Equipo
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Diego Betancourt",
              "Yancarlo Ospina",
              "Andrés Mesa",
              "Juan Manuel Mena",
              "Diego Payán",
              "Cristian Velasco",
            ].map((name) => (
              <div
                key={name}
                className="bg-[#161A21] rounded-xl p-6 border border-white/10 hover:border-blue-500 transition-colors"
                role="group"
                aria-label={`Integrante del equipo: ${name}, desarrollador`}
              >
                <h4 className="font-bold text-lg">{name}</h4>
                <p className="text-gray-400 text-sm">Desarrollador</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISION */}
        <section
          className="bg-[#20242E] rounded-2xl p-8 mb-8 border border-white/10"
          aria-labelledby="mission-title"
        >
          <h3 id="mission-title" className="text-2xl font-bold mb-4 text-blue-400">
            Nuestra Misión
          </h3>

          <p className="text-gray-300 leading-relaxed">
            Ofrecer una plataforma de videollamadas accesible, intuitiva y moderna,
            enfocada en la experiencia del usuario y la inclusión digital.
          </p>
        </section>

        {/* CONTACTO */}
        <section
          className="bg-[#20242E] rounded-2xl p-8 border border-white/10"
          aria-labelledby="contact-title"
        >
          <h3 id="contact-title" className="text-2xl font-bold mb-4 text-blue-400">
            Contáctanos
          </h3>

          <p className="text-gray-300 mb-4">
            ¿Tienes sugerencias o comentarios? Escríbenos:
          </p>

          <p className="text-gray-400">
            📧 contacto@viewcall.com
          </p>

          <p className="text-gray-400 mt-2">
            📍 Universidad del Valle — Sede Yumbo
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="bg-[#20242E]/90 py-6 mt-12"
        role="contentinfo"
        aria-label="Información institucional del proyecto"
      >
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 ViewCall — Proyecto Integrador 1</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
