import { User, LogOut, Menu, X, Keyboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [shortcutsEnabled, setShortcutsEnabled] = useState(() => {
    return localStorage.getItem("shortcutsEnabled") === "true";
  });

  useEffect(() => {
    const titles: Record<string, string> = {
      "/home": "Viewcall | Home",
      "/favorites": "Viewcall | Favorites",
      "/profile": "Viewcall | User Profile",
      "/about": "Viewcall | About",
      "/search": "Viewcall | Search Results",
      "/sign_in": "Viewcall | Sign In",
      "/sign_up": "Viewcall | Create Account",
    };

    document.title =
      titles[location.pathname] || "Viewcall | Application";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign_in");
  };

  useEffect(() => {
    if (!shortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const modifier = isMac ? e.metaKey : e.altKey;

      if (modifier && e.key.toLowerCase() === "h") {
        e.preventDefault();
        navigate("/home");
      } else if (modifier && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/profile");
      } else if (modifier && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/about");
      } else if (modifier && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/favorites");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, shortcutsEnabled]);

  const toggleShortcuts = () => {
    const newState = !shortcutsEnabled;
    setShortcutsEnabled(newState);
    localStorage.setItem("shortcutsEnabled", String(newState));
  };

  return (
    <nav
      className="bg-[#eef1ff] text-[#1a1a1a] relative shadow-md"
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4">

        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center gap-3 cursor-pointer group"
          aria-label="Ir a la página principal de Viewcall"
        >
          <img
            src="/viewcall-logo.png"
            alt="Logotipo de Viewcall"
            className="w-10 h-10 object-contain"
          />
          <h1 className="hidden sm:block text-lg font-bold">
            Viewcall
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div
          className="hidden md:flex items-center gap-3"
          role="menubar"
          aria-label="Menú principal"
        >
          {/* Profile */}
          <Link to="/profile" aria-label="Abrir perfil de usuario">
            <button
              className="p-2 bg-white border border-gray-300 rounded-full hover:bg-[#d6dbff] transition"
              aria-label="Perfil de usuario"
            >
              <User size={18} aria-hidden="true" />
            </button>
          </Link>

          {/* Keyboard Shortcuts */}
          <button
            onClick={toggleShortcuts}
            aria-pressed={shortcutsEnabled}
            aria-label={
              shortcutsEnabled
                ? "Desactivar atajos de teclado"
                : "Activar atajos de teclado"
            }
            className={`p-2 rounded-full border ${
              shortcutsEnabled
                ? "bg-green-500 text-white border-green-600"
                : "bg-white border-gray-300 text-gray-600"
            } hover:opacity-90 transition`}
          >
            <Keyboard size={18} aria-hidden="true" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="p-2 text-[#1a1a1a] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú de navegación móvil"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-300 shadow-lg"
          role="menu"
          aria-label="Menú de navegación móvil"
        >
          <div className="flex flex-col gap-3 p-4">
            <Link to="/profile" aria-label="Abrir perfil de usuario">
              <button
                className="p-2 bg-white border border-gray-300 rounded-full hover:bg-[#d6dbff] transition"
                aria-label="Perfil de usuario"
              >
                <User size={18} aria-hidden="true" />
              </button>
            </Link>

            <button
              onClick={toggleShortcuts}
              aria-pressed={shortcutsEnabled}
              aria-label={
                shortcutsEnabled
                  ? "Desactivar atajos de teclado"
                  : "Activar atajos de teclado"
              }
              className={`p-2 rounded-full border ${
                shortcutsEnabled
                  ? "bg-green-500 text-white border-green-600"
                  : "bg-white border-gray-300 text-gray-600"
              } hover:opacity-90 transition`}
            >
              <Keyboard size={18} aria-hidden="true" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
