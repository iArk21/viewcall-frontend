import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registro - Viewcall";
  }, []);

  const [usuario, setUsuario] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  const validarEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarContrasena = (password: string): boolean =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: string[] = [];

    if (!usuario) nuevosErrores.push("El nombre es obligatorio.");
    if (!apellido) nuevosErrores.push("El apellido es obligatorio.");
    if (!email) nuevosErrores.push("El correo electrónico es obligatorio.");
    else if (!validarEmail(email)) nuevosErrores.push("Debes ingresar un correo electrónico válido.");
    if (!fechaNacimiento) nuevosErrores.push("La fecha de nacimiento es obligatoria.");
    if (!contrasena) nuevosErrores.push("La contraseña es obligatoria.");
    else if (!validarContrasena(contrasena))
      nuevosErrores.push("La contraseña debe tener mínimo 8 caracteres, una mayúscula y un signo.");
    if (!confirmarContrasena) nuevosErrores.push("Debes confirmar tu contraseña.");
    else if (contrasena !== confirmarContrasena)
      nuevosErrores.push("Las contraseñas no coinciden.");

    if (nuevosErrores.length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      await registrarUsuario(usuario, apellido, email, fechaNacimiento, contrasena);
      alert("¡Registro exitoso!");
      navigate("/sign_in");
    } catch (error: any) {
      console.error(error);
      setErrores([error.message || "Error del servidor."]);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8ecf7] flex justify-center items-center px-4 pt-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl py-10 px-8 relative">

        {/* ICONO */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-25 h-18 rounded-full bg-white shadow-md flex items-center justify-center">
            <img
              src="/viewcall-logo.png"
              alt="Logo de Viewcall"
              className="w-28 h-28 mb-0"
            />
          </div>
        </div>

        <h2 className="text-center mt-10 text-gray-700 text-lg font-medium">
          Crea tu cuenta
        </h2>
        <p className="mt-1 text-center text-gray-500 text-sm">
          Bienvenido a Viewcall
        </p>

        <form
          onSubmit={manejarSubmit}
          className="mt-6 space-y-4"
          noValidate
        >
          {/* Nombres */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="Juan"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Apellidos</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="Pérez López"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Fecha de nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full p-2 rounded bg-white border border-gray-300 focus:outline-none focus:border-blue-600
              [color-scheme:white]
              [&::-webkit-calendar-picker-indicator]"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Contraseña</label>
            <div className="relative">
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 pr-10"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-3 text-gray-600"
              >
                {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmación */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Confirmar contraseña</label>
            <div className="relative">
              <input
                type={mostrarConfirmarContrasena ? "text" : "password"}
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 pr-10"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() =>
                  setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)
                }
                className="absolute right-3 top-3 text-gray-600"
              >
                {mostrarConfirmarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Errores */}
          {errores.length > 0 && (
            <div className="bg-red-100 border border-red-400 rounded p-3 text-red-600 text-sm">
              {errores.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition"
          >
            Registrarse
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/sign_in" className="text-blue-700 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
