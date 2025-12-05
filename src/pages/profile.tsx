import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User as UserIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";

import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../services/Firebaseapi";

import { setAuthToken } from "../services/authToken";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
    apellido: "",
    birthdate: "",
  });

  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();

        setUserData({
          id: data.id,
          email: data.email,
          username: data.username,
          apellido: data.lastname,
          birthdate: data.birthdate,
        });

        setFormData({
          id: data.id,
          email: data.email,
          username: data.username,
          apellido: data.lastname,
          birthdate: data.birthdate,
        });
      } catch (error: any) {
        console.error("Error al cargar perfil:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedInfo = {
        username: formData.username,
        lastname: formData.apellido,
        email: formData.email,
        birthdate: formData.birthdate,
      };

      await updateProfile(updatedInfo);

      setUserData({ ...userData, ...updatedInfo });

      alert("Cambios guardados exitosamente");
    } catch (error: any) {
      console.error("Error al guardar cambios:", error.message);
      alert(`Failed to save changes: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible."
      )
    )
      return;

    try {
      await deleteProfile();
      setAuthToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      alert("Cuenta eliminada exitosamente");
      navigate("/sign_in");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la Cuenta");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#141414] min-h-screen text-white flex items-center justify-center">
        <Navbar />
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef2ff] to-[#e3e8ff] p-6">
      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-300">
          
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition mb-6 font-medium cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          <h1 className="text-3xl font-bold mb-8 text-center text-black">
            Mi perfil
          </h1>

          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 rounded-full w-24 h-24 flex items-center justify-center">
              <UserIcon size={48} className="text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-black mb-4">
              Información de la cuenta
            </h3>

            {/* Username */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-300 shadow-sm">
              <label className="text-xs text-gray-500">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              />
            </div>

            {/* Apellido */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-300 shadow-sm">
              <label className="text-xs text-gray-500">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              />
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-300 shadow-sm">
              <label className="text-xs text-gray-500">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              />
            </div>

            {/* Birthdate */}
            <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
              <label className="text-xs text-gray-500">Fecha de nacimiento</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate?.split("T")[0] || ""}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              />
            </div>
          </div>

          {/* Botón para cambiar contraseña */}
          {/* Enlace para cambiar contraseña */}
        

          <div className="mt-6 p-5 bg-white rounded-xl shadow-sm border border-gray-200">

          {/* Enlace cambiar contraseña */}
          <div className="flex justify-center mb-4">
            <p
              onClick={() => navigate("/change_password")}
              className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer transition 
                        underline underline-offset-4 font-medium"
            >
              Cambiar contraseña
            </p>
          </div>

          {/* Líneas separadoras suaves */}
          <hr className="border-gray-200 mb-4" />

          {/* Botón guardar cambios */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg 
                      font-semibold transition-shadow shadow-sm hover:shadow-md"
          >
            Guardar cambios
          </button>

          {/* Botón eliminar cuenta */}
          <button
            onClick={handleDelete}
            className="w-full py-3 mt-3 bg-red-400 hover:bg-red-300 text-white 
                      rounded-lg font-semibold transition-shadow shadow-sm hover:shadow-md"
          >
            Eliminar cuenta
          </button>
          </div>

        </div>
      </div>
    </div>
  );
}
