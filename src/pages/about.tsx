import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * About component
 * 
 * Displays information about the ViewCall project, including:
 * - Project description
 * - Team members
 * - Mission
 * - Contact information
 * 
 * This page is part of the academic project "Proyecto Integrador 1"
 * for Universidad del Valle — Sede Yumbo.
 * 
 * @component
 * @returns {JSX.Element} The rendered About page
 */
const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#131820] text-white">

      {/* Header */}
      <header className="bg-[#20242E]/90 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors mr-4"
            aria-label="Go back"
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

          <h1 className="text-2xl font-bold">Sobre ViewCall</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Logo + Title */}
        <div className="text-center mb-12">
          <img
            src="/viewcall-logo.png"
            alt="ViewCall logo"
            className="w-32 h-32 mx-auto mb-6 rounded-xl"
          />

          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            ViewCall
          </h2>

          <p className="text-xl text-gray-300">
            Connecting people with a modern video call experience.
          </p>
        </div>

        {/* Academic project description */}
        <section className="bg-[#20242E] rounded-2xl p-8 mb-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">
            Academic Project
          </h3>

          <p className="text-gray-300 leading-relaxed mb-4">
            ViewCall is a platform developed by students of{" "}
            <span className="text-blue-400 font-semibold">
              Universidad del Valle — Yumbo Campus
            </span>{" "}
            as part of the{" "}
            <span className="text-blue-400 font-semibold">Proyecto Integrador 1</span> course.
          </p>

          <p className="text-gray-300 leading-relaxed">
            This project applies knowledge in web development, UX/UI,
            modern technologies and digital communication to build a scalable
            and functional solution for video calls and virtual meetings.
          </p>
        </section>

        {/* Team section */}
        <section className="bg-[#20242E] rounded-2xl p-8 mb-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-6 text-blue-400 text-center">
            Our Team
          </h3>

          <p className="text-gray-300 text-center mb-8">
            Project developed by:
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Diego */}
            <div className="bg-[#161A21] rounded-xl p-6 border border-white/10 hover:border-blue-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  DB
                </div>
                <div>
                  <h4 className="font-bold text-lg">Diego Betancourt</h4>
                  <p className="text-gray-400 text-sm">Developer</p>
                </div>
              </div>
            </div>

            {/* Yancarlo */}
            <div className="bg-[#161A21] rounded-xl p-6 border border-white/10 hover:border-blue-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  YO
                </div>
                <div>
                  <h4 className="font-bold text-lg">Yancarlo Ospina</h4>
                  <p className="text-gray-400 text-sm">Developer</p>
                </div>
              </div>
            </div>

            {/* Andrés */}
            <div className="bg-[#161A21] rounded-xl p-6 border border-white/10 hover:border-blue-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  AM
                </div>
                <div>
                  <h4 className="font-bold text-lg">Andres Mesa</h4>
                  <p className="text-gray-400 text-sm">Developer</p>
                </div>
              </div>
            </div>

            {/* Juan Manuel */}
            <div className="bg-[#161A21] rounded-xl p-6 border border-white/10 hover:border-blue-500 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  JM
                </div>
                <div>
                  <h4 className="font-bold text-lg">Juan Manuel Mena</h4>
                  <p className="text-gray-400 text-sm">Developer</p>
                </div>
              </div>
            </div>

            {/* Diego Payan */}
            <div className="bg-[#161A21] rounded-xl p-6 border border-white/10 hover:border-blue-500 transition-colors md:col-span-2 md:w-1/2 md:mx-auto">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  DP
                </div>
                <div>
                  <h4 className="font-bold text-lg">Diego Payan</h4>
                  <p className="text-gray-400 text-sm">Developer</p>
                </div>
              </div>
            </div>

            {/* Cristian Velasco */}
            <div className="bg-[#161A21] rounded-xl p-6 border border-white/10 hover:border-blue-500 transition-colors md:col-span-2 md:w-1/2 md:mx-auto">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  CV
                </div>
                <div>
                  <h4 className="font-bold text-lg">Cristian Velasco</h4>
                  <p className="text-gray-400 text-sm">Developer</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Mission */}
        <section className="bg-[#20242E] rounded-2xl p-8 mb-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">
            Our Mission
          </h3>

          <p className="text-gray-300 leading-relaxed">
            At ViewCall we believe virtual meetings should be simple, intuitive,
            and accessible. Our mission is to deliver a smooth video call 
            experience focused on usability, speed, and modern tools without 
            complexity.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-[#20242E] rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold mb-4 text-blue-400">
            Contact Us
          </h3>

          <p className="text-gray-300 mb-4">
            Do you have suggestions or feedback? We would love to hear from you!
          </p>

          <div className="space-y-2 text-gray-400">
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              contacto@viewcall.com
            </p>

            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Universidad del Valle — Sede Yumbo
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#20242E]/90 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2025 ViewCall — Proyecto Integrador 1</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
