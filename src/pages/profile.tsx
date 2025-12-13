import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User as UserIcon } from "lucide-react";
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

        const parsedData = {
          id: data.id,
          email: data.email,
          username: data.username,
          apellido: data.lastname,
          birthdate: data.birthdate,
        };

        setUserData(parsedData);
        setFormData(parsedData);
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
      await updateProfile({
        username: formData.username,
        lastname: formData.apellido,
        email: formData.email,
        birthdate: formData.birthdate,
      });

      setUserData(formData);
      alert("Cambios guardados exitosamente");
    } catch (error: any) {
      alert(`Error al guardar cambios: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible.")) return;

    try {
      await deleteProfile();
      setAuthToken(null);
      localStorage.clear();
      navigate("/sign_in");
    } catch (error) {
      alert("Error al eliminar la cuenta");
    }
  };

  if (loading) {
    return (
      <div
        className="bg-[#141414] min-h-screen text-white flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Navbar />
        <p className="text-gray-400">Cargando perfil…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eef2ff] to-[#e3e8ff] p-6"
      role="main"
      aria-labelledby="profile-title"
    >
      <Navbar />

      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <section
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-300"
          role="form"
          aria-label="Formulario de edición del perfil de usuario"
        >
          {/* VOLVER */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition mb-6 font-medium cursor-pointer"
            aria-label="Volver a la página principal"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            <span>Volver</span>
          </button>

          <h1
            id="profile-title"
            className="text-3xl font-bold mb-8 text-center text-black"
          >
            Mi perfil
          </h1>

          {/* AVATAR */}
          <div
            className="flex justify-center mb-8"
            aria-label="Avatar del usuario"
          >
            <div className="bg-blue-600 rounded-full w-24 h-24 flex items-center justify-center">
              <UserIcon size={48} className="text-white" aria-hidden="true" />
            </div>
          </div>

          {/* INFORMACIÓN */}
          <section aria-labelledby="account-info-title">
            <h3
              id="account-info-title"
              className="text-lg font-semibold text-black mb-4"
            >
              Información de la cuenta
            </h3>

            {/* USERNAME */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-300 shadow-sm">
              <label htmlFor="username" className="text-xs text-gray-500">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
                aria-required="true"
              />
            </div>

            {/* APELLIDO */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-300 shadow-sm">
              <label htmlFor="apellido" className="text-xs text-gray-500">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                aria-label="Apellido del usuario"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              />
            </div>

            {/* EMAIL */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-300 shadow-sm">
              <label htmlFor="email" className="text-xs text-gray-500">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                aria-required="true"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              />
            </div>

            {/* FECHA NACIMIENTO */}
            <div className="bg-white rounded-xl p-4 border border-gray-300 shadow-sm">
              <label htmlFor="birthdate" className="text-xs text-gray-500">
                Fecha de nacimiento
              </label>
              <input
                id="birthdate"
                type="date"
                name="birthdate"
                value={formData.birthdate?.split("T")[0] || ""}
                onChange={handleChange}
                aria-label="Fecha de nacimiento del usuario"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300"
              />
            </div>
          </section>

          {/* ACCIONES */}
          <section className="mt-6 p-5 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-center mb-4">
              <button
                onClick={() => navigate("/change_password")}
                className="text-sm text-blue-600 hover:text-blue-500 underline underline-offset-4 font-medium"
                aria-label="Ir a cambiar contraseña"
              >
                Cambiar contraseña
              </button>
            </div>

            <hr className="border-gray-200 mb-4" />

            <button
              onClick={handleSave}
              className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold"
              aria-label="Guardar cambios del perfil"
            >
              Guardar cambios
            </button>

            <button
              onClick={handleDelete}
              className="w-full py-3 mt-3 bg-red-400 hover:bg-red-300 text-white rounded-lg font-semibold"
              aria-label="Eliminar cuenta de usuario"
            >
              Eliminar cuenta
            </button>
          </section>
        </section>
      </div>
    </div>
  );
}
