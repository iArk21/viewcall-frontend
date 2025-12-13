import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../services/Firebaseapi";

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registro | Viewcall";
  }, []);

  const [usuario, setUsuario] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] =
    useState(false);

  const [errores, setErrores] = useState<string[]>([]);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores([]);

    try {
      await registerUser({
        email: email.trim(),
        password: contrasena,
        username: usuario,
        lastname: apellido,
        birthdate: fechaNacimiento,
      });

      alert("¡Registro exitoso!");
      navigate("/sign_in");
    } catch (error: any) {
      setErrores([error.message || "Error en el registro"]);
    }
  };

  return (
    <main
      className="min-h-screen bg-[#e8ecf7] flex justify-center items-center px-4 pt-10"
      role="main"
      aria-labelledby="signup-title"
    >
      <section
        className="bg-white w-full max-w-md rounded-2xl shadow-xl py-10 px-8"
        role="form"
        aria-label="Formulario de registro"
      >
        {/* Logo */}
        <header className="flex flex-col items-center mb-8">
          <img
            src="/viewcall-logo.png"
            alt="Logo de Viewcall"
            className="w-28 h-28"
          />

          <h1
            id="signup-title"
            className="mt-6 text-gray-700 text-xl font-semibold"
          >
            Crea tu cuenta
          </h1>

          <p className="text-gray-500 text-sm">
            Bienvenido a Viewcall
          </p>
        </header>

        {/* FORM */}
        <form onSubmit={manejarSubmit} className="space-y-4" noValidate>
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="text-sm text-gray-700 font-medium">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              required
              minLength={3}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="Juan"
              aria-required="true"
              aria-label="Nombre"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label
              htmlFor="apellido"
              className="text-sm text-gray-700 font-medium"
            >
              Apellidos
            </label>
            <input
              id="apellido"
              type="text"
              required
              minLength={3}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="Pérez López"
              aria-required="true"
              aria-label="Apellidos"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm text-gray-700 font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="correo@ejemplo.com"
              aria-required="true"
              aria-label="Correo electrónico"
            />
          </div>

          {/* Fecha Nacimiento */}
          <div>
            <label
              htmlFor="birthdate"
              className="text-sm text-gray-700 font-medium"
            >
              Fecha de nacimiento
            </label>
            <input
              id="birthdate"
              type="date"
              required
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
              aria-required="true"
              aria-label="Fecha de nacimiento"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="text-sm text-gray-700 font-medium"
            >
              Contraseña
            </label>

            <div className="relative">
              <input
                id="password"
                type={mostrarContrasena ? "text" : "password"}
                required
                minLength={8}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 pr-10"
                placeholder="********"
                aria-required="true"
                aria-describedby="password-help"
              />

              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
                className="absolute right-3 top-3 text-gray-600"
                aria-label={
                  mostrarContrasena
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                aria-pressed={mostrarContrasena}
              >
                {mostrarContrasena ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>

            <span id="password-help" className="sr-only">
              Mínimo 8 caracteres, una mayúscula y un símbolo especial
            </span>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label
              htmlFor="confirm-password"
              className="text-sm text-gray-700 font-medium"
            >
              Confirmar contraseña
            </label>

            <div className="relative">
              <input
                id="confirm-password"
                type={mostrarConfirmarContrasena ? "text" : "password"}
                required
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 pr-10"
                placeholder="********"
                aria-required="true"
                aria-label="Confirmar contraseña"
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarConfirmarContrasena(
                    !mostrarConfirmarContrasena
                  )
                }
                className="absolute right-3 top-3 text-gray-600"
                aria-label={
                  mostrarConfirmarContrasena
                    ? "Ocultar confirmación de contraseña"
                    : "Mostrar confirmación de contraseña"
                }
                aria-pressed={mostrarConfirmarContrasena}
              >
                {mostrarConfirmarContrasena ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Errores backend */}
          {errores.length > 0 && (
            <div
              className="bg-red-100 border border-red-400 rounded p-3 text-red-700 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {errores.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
            aria-label="Registrarse en Viewcall"
          >
            Registrarse
          </button>

          <p className="text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/sign_in"
              className="text-blue-700 hover:underline"
              aria-label="Ir a iniciar sesión"
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
