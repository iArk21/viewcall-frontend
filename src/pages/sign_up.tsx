import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../services/Firebaseapi";

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registro - Viewcall";
  }, []);

  // Form states
  const [usuario, setUsuario] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] =
    useState(false);

  // Errores backend
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
      console.error(error);
      setErrores([error.message || "Error en el registro"]);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8ecf7] flex justify-center items-center px-4 pt-10">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl py-10 px-8 relative">
        
        {/* Logo */}
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

        {/* FORM */}
        <form onSubmit={manejarSubmit} className="mt-6 space-y-4">
          
          {/* Nombre */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Nombre</label>
            <input
              type="text"
              required
              minLength={3}
              value={usuario}
              onChange={(e) => {
                setUsuario(e.target.value);
                e.target.setCustomValidity("");

                if (e.target.value.length < 3) {
                  e.target.setCustomValidity(
                    "El nombre debe tener mínimo 3 caracteres."
                  );
                }
              }}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="Juan"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Apellidos</label>
            <input
              type="text"
              required
              minLength={3}
              value={apellido}
              onChange={(e) => {
                setApellido(e.target.value);
                e.target.setCustomValidity("");

                if (e.target.value.length < 3) {
                  e.target.setCustomValidity(
                    "El apellido debe tener mínimo 3 caracteres."
                  );
                }
              }}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="Pérez López"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                e.target.setCustomValidity("");

                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!regex.test(e.target.value)) {
                  e.target.setCustomValidity(
                    "Incluye un signo '@' en la dirección de correo electrónico."
                  );
                }
              }}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Fecha Nacimiento */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              required
              value={fechaNacimiento}
              onChange={(e) => {
                setFechaNacimiento(e.target.value);
                e.target.setCustomValidity("");
              }}
              className="w-full p-2 rounded bg-white border border-gray-300"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-gray-700 text-sm font-medium">Contraseña</label>
            <div className="relative">
              <input
                type={mostrarContrasena ? "text" : "password"}
                required
                value={contrasena}
                minLength={8}
                onChange={(e) => {
                  setContrasena(e.target.value);
                  e.target.setCustomValidity("");

                  const regex =
                    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

                  if (!regex.test(e.target.value)) {
                    e.target.setCustomValidity(
                      "Debe tener 8 caracteres, una mayúscula y un símbolo especial."
                    );
                  }
                }}
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

          {/* Confirmar Contraseña */}
          <div>
            <label className="text-gray-700 text-sm font-medium">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmarContrasena ? "text" : "password"}
                required
                value={confirmarContrasena}
                onChange={(e) => {
                  setConfirmarContrasena(e.target.value);
                  e.target.setCustomValidity("");

                  if (e.target.value !== contrasena) {
                    e.target.setCustomValidity("Las contraseñas no coinciden.");
                  }
                }}
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
                {mostrarConfirmarContrasena ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Errores del backend */}
          {errores.length > 0 && (
            <div className="bg-red-100 border border-red-400 rounded p-3 text-red-600 text-sm">
              {errores.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          {/* botón */}
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