/**
 * SignIn Component
 * WCAG 2.1 – Perceptible, Operable y Comprensible
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { setAuthToken } from "../services/authToken";
import { loginWithEmailPassword, getProfile } from "../services/Firebaseapi";
import { auth } from "../lib/firebase.config";
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const [email, setUsuario] = useState("");
  const [password, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Iniciar sesión | Viewcall";
  }, []);

  const validarEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarContrasena = (password: string): boolean =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevosErrores: string[] = [];

    if (!email) nuevosErrores.push("El correo electrónico es obligatorio.");
    else if (!validarEmail(email))
      nuevosErrores.push("Debes ingresar un correo electrónico válido.");

    if (!password) nuevosErrores.push("La contraseña es obligatoria.");
    else if (!validarContrasena(password))
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
      const { idToken } = await loginWithEmailPassword(
        email.trim(),
        password
      );
      setAuthToken(idToken);

      const userData = await getProfile();
      localStorage.setItem("userName", userData.username);
      localStorage.setItem("user", JSON.stringify(userData));

      alert("Inicio de sesión exitoso");
      navigate("/home");
    } catch (error: any) {
      setErrores([error.message || "Credenciales inválidas"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef2ff] to-[#e3e8ff] p-6"
      role="main"
      aria-labelledby="signin-title"
    >
      <section
        className="w-full max-w-md bg-white shadow-xl rounded-3xl px-10 py-12 border border-gray-100"
        role="form"
        aria-label="Formulario de inicio de sesión"
      >
        {/* Header */}
        <header className="flex flex-col items-center mb-10">
          <img
            src="/viewcall-logo.png"
            alt="Logo de Viewcall"
            className="w-28 h-28"
          />
          <h1
            id="signin-title"
            className="text-3xl font-extrabold tracking-wide"
          >
            VIEWCALL
          </h1>
          <p className="text-gray-400 text-sm text-center mt-1">
            Inicia sesión para continuar
          </p>
        </header>

        {/* Form */}
        <form onSubmit={manejarSubmit} className="space-y-6" noValidate>
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-600 font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled={isLoading}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              aria-required="true"
              aria-invalid={errores.length > 0}
              aria-label="Correo electrónico"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm text-gray-600 font-medium"
            >
              Contraseña
            </label>

            <div className="relative">
              <input
                id="password"
                type={mostrarContrasena ? "text" : "password"}
                value={password}
                disabled={isLoading}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                aria-required="true"
                aria-invalid={errores.length > 0}
                aria-describedby="password-help"
              />

              <button
                type="button"
                disabled={isLoading}
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                aria-label={
                  mostrarContrasena
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                aria-pressed={mostrarContrasena}
              >
                {mostrarContrasena ? (
                  <EyeOff size={20} aria-hidden="true" />
                ) : (
                  <Eye size={20} aria-hidden="true" />
                )}
              </button>
            </div>

            <span id="password-help" className="sr-only">
              La contraseña debe tener al menos 8 caracteres, una mayúscula y un
              símbolo
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold flex justify-center items-center gap-2"
            aria-label="Iniciar sesión"
          >
            {isLoading && (
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            )}
            {isLoading ? "Iniciando..." : "Iniciar sesión"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4" aria-hidden="true">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-xs text-gray-400">o continúa con</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* OAuth Buttons */}
          <button
            type="button"
            onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
            className="w-full py-3 flex items-center justify-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            aria-label="Iniciar sesión con Google"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt=""
              className="w-5 h-5"
            />
            Google
          </button>

          <button
            type="button"
            onClick={() => signInWithPopup(auth, new FacebookAuthProvider())}
            className="w-full py-3 flex items-center justify-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            aria-label="Iniciar sesión con Facebook"
          >
            <img
              src="https://www.svgrepo.com/show/452196/facebook-1.svg"
              alt=""
              className="w-5 h-5"
            />
            Facebook
          </button>

          <button
            type="button"
            onClick={() => signInWithPopup(auth, new GithubAuthProvider())}
            className="w-full py-3 flex items-center justify-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            aria-label="Iniciar sesión con GitHub"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt=""
              className="w-5 h-5"
            />
            GitHub
          </button>

          {/* Forgot password */}
          <div className="text-center">
            <Link
              to="/forgot_password"
              className="text-xs text-gray-400 hover:text-blue-500"
              aria-label="Recuperar contraseña"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Errors */}
          {errores.length > 0 && (
            <div
              className="bg-red-900/30 border border-red-600 rounded-lg p-3"
              role="alert"
              aria-live="assertive"
            >
              {errores.map((err, idx) => (
                <p key={idx} className="text-red-400 text-xs">
                  • {err}
                </p>
              ))}
            </div>
          )}

          {/* Register */}
          <p className="text-center text-xs text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link
              to="/sign_up"
              className="text-blue-500 hover:underline"
              aria-label="Registrarse en Viewcall"
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default SignIn;
