import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/Firebaseapi";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    c: false,
    n: false,
    r: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const validar = (pass: string) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(pass);

  const handleSubmit = async () => {
    if (!data.current || !data.newPass || !data.confirm) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (data.newPass !== data.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!validar(data.newPass)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, 1 mayúscula y 1 caracter especial."
      );
      return;
    }

    try {
      await changePassword("", data.current, data.newPass);

      alert("Contraseña actualizada correctamente");
      navigate("/profile");
    } catch (e: any) {
      setError(e.message || "Error al actualizar contraseña");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2ff] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">
          Cambiar contraseña
        </h1>

        {/* Actual */}
        <div className="mb-4">
          <label className="text-xs text-gray-500">Contraseña actual</label>
          <div className="flex items-center gap-2">
            <input
              type={show.c ? "text" : "password"}
              name="current"
              value={data.current}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <button
              onClick={() => setShow({ ...show, c: !show.c })}
              className="text-gray-500"
            >
              {show.c ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Nueva */}
        <div className="mb-4">
          <label className="text-xs text-gray-500">Nueva contraseña</label>
          <div className="flex items-center gap-2">
            <input
              type={show.n ? "text" : "password"}
              name="newPass"
              value={data.newPass}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <button
              onClick={() => setShow({ ...show, n: !show.n })}
              className="text-gray-500"
            >
              {show.n ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Confirmar */}
        <div className="mb-4">
          <label className="text-xs text-gray-500">Confirmar nueva contraseña</label>
          <div className="flex items-center gap-2">
            <input
              type={show.r ? "text" : "password"}
              name="confirm"
              value={data.confirm}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <button
              onClick={() => setShow({ ...show, r: !show.r })}
              className="text-gray-500"
            >
              {show.r ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-2 text-sm font-medium">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 mt-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold"
        >
          Guardar nueva contraseña
        </button>
      </div>
    </div>
  );
}
