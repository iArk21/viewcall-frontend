import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../services/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const { initAuthObserver, loginWithGoogle } = useAuthStore();

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
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


  const manejarLoginConGoogle = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGoogle().then(() => navigate("/home"));
  };

  useEffect(() => {
    const unsub = initAuthObserver();
    return () => { unsub(); };
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

          {/* Contraseña */}
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

          {/* Botón */}
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

          {/* Botón Google */}
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

          {/* Forgot Password */}
          <div className="text-center">
            <Link
              to="/forgot_password"
              className="text-xs text-gray-400 hover:text-blue-500 transition"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Errores */}
          {errores.length > 0 && (
            <div className="bg-red-900/30 border border-red-600 rounded-lg p-3 space-y-1">
              {errores.map((err, idx) => (
                <p key={idx} className="text-red-400 text-xs flex items-start">
                  <span className="mr-2">•</span> {err}
                </p>
              ))}
            </div>
          )}

          {/* Registro */}
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
