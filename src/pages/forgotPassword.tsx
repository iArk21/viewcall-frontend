import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/Firebaseapi";

/**
 * ForgotPassword Component
 * Handles the password recovery flow by allowing users to submit their email
 * @returns {JSX.Element} Password recovery form
 */
const ForgotPassword: React.FC = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State to store the email input value
  const [email, setEmail] = useState("");

  // State to store success message
  const [mensaje, setMensaje] = useState("");

  // State to store error message
  const [error, setError] = useState("");

  /**
   * Handles form submission
   * Validates email field and simulates sending a recovery email
   * @param {React.FormEvent} e - Form event
   */
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      setMensaje("");
      return;
    }

    try {
      setError("");
      setMensaje("");

      const resp = await requestPasswordReset(email.trim());
      setMensaje(resp.message || "Se ha enviado un correo para restablecer tu contraseña.");

    } catch (err: any) {
      setError(err.message || "Error al enviar el correo. Inténtalo nuevamente.");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef2ff] to-[#e3e8ff] p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl px-10 py-12 border border-gray-100">
        {/* Back button - navigates to previous page */}
        <button
          onClick={() => navigate("/sign_in")}
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

        {/* Header section with logo and title */}
        <div className="flex flex-col items-center mb-8">
          <img src="/viewcall-logo.png" alt="Logo" className="w-28 h-28 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-center mb-2">
            Recupera tu Contraseña
          </h1>
          <p className="text-gray-400 text-sm text-center">
            Ingresa el correo asociado a tu cuenta
          </p>
        </div>

        {/* Password recovery form */}
        <form onSubmit={manejarSubmit} className="flex flex-col space-y-5">
          {/* Email input field */}
          <div>
            <label className="block text-sm mb-1 text-black-300">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          {/* Error message display */}
          {error && (
            <div className="bg-red-900/30 border border-red-600 rounded p-3 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Success message display */}
          {mensaje && (
            <div className="bg-green-900/30 border border-green-600 rounded p-3 text-green-400 text-xs">
              {mensaje}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-700 hover:bg-blue-800 transition text-white rounded-lg font-semibold"
          >
            Enviar email
          </button>

          {/* Link back to sign in page */}
          <p className="text-center text-xs text-gray-400 mt-3">
            ¿Recordaste tu contraseña?{" "}
            <Link to="/sign_in" className="text-blue-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;  