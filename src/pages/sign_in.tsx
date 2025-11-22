/**
 * SignIn Component
 *
 * Handles the user login process using:
 * - Email and password authentication
 * - Google OAuth login (via Zustand store)
 *
 * Includes:
 * - Form validation
 * - Password visibility toggle
 * - Real-time error display
 * - Loading state management
 * - Automatic redirect after successful login
 * - Google login using Firebase/Auth observer
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  /** Zustand store: initializes the auth listener and Google login */
  const { initAuthObserver, loginWithGoogle } = useAuthStore();

  /** Email entered by the user */
  const [usuario, setUsuario] = useState("");

  /** Password entered by the user */
  const [contrasena, setContrasena] = useState("");

  /** Controls whether the password is shown as plain text */
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  /** Array of validation or server errors */
  const [errores, setErrores] = useState<string[]>([]);

  /** Indicates whether the login request is in progress */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Updates page title when component loads.
   */
  useEffect(() => {
    document.title = "Iniciar sesión | Viewcall";
  }, []);

  /**
   * Validates whether a string is a valid email.
   *
   * @param email - The email to validate
   * @returns True if valid format, otherwise false
   */
  const validarEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /**
   * Validates password strength.
   * Must include:
   * - Minimum 8 characters
   * - At least 1 uppercase letter
   * - At least 1 special character
   *
   * @param password - The password to validate
   * @returns True if strong, otherwise false
   */
  const validarContrasena = (password: string): boolean =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
      password
    );

  /**
   * Handles the login form submission.
   * Performs:
   * - Client-side validation
   * - API login request
   * - Storage of authentication token
   * - Redirection after success
   *
   * @param e - Form submit event
   */
  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: string[] = [];

    if (!usuario) nuevosErrores.push("El correo electrónico es obligatorio.");
    else if (!validarEmail(usuario))
      nuevosErrores.push("Debes ingresar un correo electrónico válido.");

    if (!contrasena) nuevosErrores.push("La contraseña es obligatoria.");
    else if (!validarContrasena(contrasena))
      nuevosErrores.push(
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo."
      );

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setIsLoading(true);
    setErrores([]);

    try {
      const data = await loginUsuario(usuario, contrasena);

      // Save user authentication info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error: any) {
      setErrores([error.message || "Credenciales inválidas."]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles Google login button.
   * Uses Zustand store + Firebase auth.
   *
   * @param e - Click event
   */
  const manejarLoginConGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogle().then(() => navigate("/home"));
  };

  /**
   * When component loads, this initializes
   * Firebase Auth state observer (via Zustand).
   * Automatically cleans up on unmount.
   */
  useEffect(() => {
    const unsub = initAuthObserver();
    return () => {
      unsub();
    };
  }, [initAuthObserver]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef2ff] to-[#e3e8ff] p-6">
      <div
        className="w-full max-w-md bg-white shadow-xl rounded-3xl px-10 py-12 border border-gray-100"
        role="form"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/viewcall-logo.png"
            alt="Logo de Viewcall"
            className="w-28 h-28 mb-0"
          />
          <h1 className="text-3xl font-extrabold text-tracking-wide">
            VIEWCALL
          </h1>
          <p className="text-gray-400 text-sm text-center mt-1">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={manejarSubmit} className="space-y-6">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-300 font-medium">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={usuario}
              disabled={isLoading}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm text-gray-300 font-medium"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                disabled={isLoading}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 transition"
              >
                {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-blue-700 hover:bg-blue-800 transition text-white rounded-lg font-semibold"
          >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-xs text-gray-400">o continúa con</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={manejarLoginConGoogle}
            className="w-full py-3 flex items-center justify-center gap-3 
             border border-gray-300 rounded-lg bg-white 
             hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Iniciar sesión con Google
          </button>

          {/* Forgot password */}
          <div className="text-center">
            <Link
              to="/forgot_password"
              className="text-xs text-gray-400 hover:text-blue-500 transition"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error messages */}
          {errores.length > 0 && (
            <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 space-y-1">
              {errores.map((err, idx) => (
                <p key={idx} className="text-red-400 text-xs flex items-start">
                  <span className="mr-2">•</span> {err}
                </p>
              ))}
            </div>
          )}

          {/* Register link */}
          <p className="text-center text-xs text-gray-400 mt-2">
            ¿No tienes cuenta?{" "}
            <Link to="/sign_up" className="text-blue-500 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignIn;
