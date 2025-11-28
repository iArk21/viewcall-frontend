import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "../components/Navbar";

import {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
} from "../services/Firebaseapi";

import { AUTH_TOKEN_EVENT, getAuthToken, setAuthToken } from '../services/authToken';

/**
 * Profile Component
 * 
 * Allows the user to view and update personal information such as:
 * - Username
 * - Last name
 * - Email
 * - Birthdate
 * - Password
 * 
 * The component includes:
 * - Form validation
 * - Password strength checking
 * - WCAG accessible feedback (ARIA live regions)
 * - Account deletion support
 * 
 * @component
 * @returns {JSX.Element}
 */
export default function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Stores the main profile information of the user.
   */
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    username: "",
    apellido: "",
    birthdate: "",
  });

  /**
   * Stores the editable form information.
   * Initialized with userData once the profile is loaded.
   */
  const [formData, setFormData] = useState(userData);

  /**
   * Handles password updating fields.
   */
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * Toggles visibility for each password field.
   */
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  /** Displays password validation or mismatch errors */
  const [passwordError, setPasswordError] = useState("");

  /**
   * Validates the strength of a password.
   *
   * Requirements:
   * - Minimum 8 characters
   * - One uppercase letter
   * - One special character
   *
   * @param {string} password - Password to validate
   * @returns {boolean} Whether the password meets the requirements
   */
  const validarContrasena = (password: string): boolean => {
    const regex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getProfile(); // ahora enviará token
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



  /**
   * Handles input text changes for profile fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles changes for password fields.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  /**
   * Toggles the visibility of a password field.
   *
   * @param {"new" | "confirm"} field - Field to toggle visibility
   */
  const togglePasswordVisibility = (field: "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /**
   * Handles updating the profile.
   * Validates password if changed and updates user data in the backend.
   */
// --- Guardar cambios ---
const handleSave = async () => {
  try {
    // Validación de contraseña
    const { newPassword, confirmPassword } = passwordData;
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match.");
        return;
      }
      if (!validarContrasena(newPassword)) {
        setPasswordError(
          "The password must be at least 8 characters long, contain one uppercase letter and one special character."
        );
        return;
      }

            // Cambiar contraseña vía Firebase API
      await changePassword(formData.email, "", newPassword); // "" porque no tienes currentPassword en tu UI
    }

       // Actualizar resto de datos
    const updatedInfo = {
      username: formData.username,
      lastname: formData.apellido,
      email: formData.email,
      birthdate: formData.birthdate,
    };
    await updateProfile(updatedInfo);

    setUserData({ ...userData, ...updatedInfo });
    setPasswordData({ newPassword: "", confirmPassword: "" });
    setPasswordError("");
    alert("Cambios guardados exitosamente");
  } catch (error: any) {
    console.error("Error al guardar cambios:", error.message);
    alert(`Failed to save changes: ${error.message}`);
  }
};

  /**
   * Handles deleting the user account.
   * Confirms the action and removes the user's credentials.
   */
  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.")) return;

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

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

  
  /** Loading screen */
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
        <div
          className="relative w-full max-w-md bg-blue rounded-2xl shadow-2xl p-8 border border-gray-800"
          role="form"
          aria-label="Formulario de perfil de usuario"
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition mb-6 font-medium"
            aria-label="Volver al inicio"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-8 text-center text-black">
            Mi perfil
          </h1>

          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="bg-blue-600 rounded-full w-24 h-24 flex items-center justify-center">
              <UserIcon size={48} className="text-white" />
            </div>
          </div>

          {/* Editable fields */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-black mb-4">
              Información de la cuenta
            </h3>

            {/* Username */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <UserIcon size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label htmlFor="username" className="text-xs text-gray-500 block">
                    Nombre de usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    aria-required="true"
                    className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <UserIcon size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label htmlFor="apellido" className="text-xs text-gray-500 block">
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    aria-required="true"
                    className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl p-4 mb-3 border border-gray-700">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label htmlFor="email" className="text-xs text-gray-500 block">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-required="true"
                    className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Birth date */}
            <div className="bg-white rounded-xl p-4 border border-gray-700 mb-8">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div className="flex-1">
                  <label htmlFor="birthdate" className="text-xs text-gray-500 block">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="birthdate"
                    type="date"
                    name="birthdate"
                    value={
                      formData.birthdate
                        ? formData.birthdate.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    aria-required="true"
                    className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Password update section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-4">
                Actualizar contraseña
              </h3>

              {/* Nueva contraseña */}
              <div className="bg-white rounded-xl p-4 mb-3 border border-gray-700">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <label
                      htmlFor="newPassword"
                      className="text-xs text-gray-500 block"
                    >
                      Nueva contraseña
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        aria-label="Nueva contraseña"
                        aria-required="false"
                        aria-invalid={passwordError ? "true" : "false"}
                        aria-describedby={passwordError ? "passwordError" : undefined}
                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        aria-label={
                          showPasswords.new
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="text-gray-400 hover:text-white transition"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="bg-white rounded-xl p-4 mb-3 border border-gray-700">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs text-gray-500 block"
                    >
                      Confirmar nueva contraseña
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        aria-label="Confirmar nueva contraseña"
                        aria-required="false"
                        aria-invalid={passwordError ? "true" : "false"}
                        aria-describedby={passwordError ? "passwordError" : undefined}
                        className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        aria-label={
                          showPasswords.confirm
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="text-gray-400 hover:text-white transition"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de error accesible */}
              {passwordError && (
                <p
                  id="passwordError"
                  role="alert"
                  aria-live="assertive"
                  className="text-red-500 text-sm mt-2 text-center font-medium"
                >
                  {passwordError}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSave}
              className="w-full py-3 mt-2 bg-blue-700 hover:bg-blue-800 transition text-white rounded-lg font-semibold"
            >
              Guardar cambios
            </button>

            <button
              onClick={handleDelete}
              className="w-full py-3 bg-red-700 hover:bg-red-600 text-white rounded-xl font-semibold transition shadow-md"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
