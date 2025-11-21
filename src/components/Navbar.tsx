import { User, LogOut, Menu, X, Keyboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Para detectar la ruta actual
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(() => {
    return localStorage.getItem("shortcutsEnabled") === "true";
  });

  // ✅ Actualiza el título de la página según la ruta (criterio 2.4.2)
  useEffect(() => {
    const titles: Record<string, string> = {
      "/home": "Viewcall | Inicio",
      "/favorites": "Viewcall | Favoritas",
      "/profile": "Viewcall  | Perfil de usuario",
      "/about": "Viewcall  | Acerca de",
      "/search": "Viewcall | Resultados de búsqueda",
      "/sign_in": "Viewcall  | Iniciar sesión",
      "/sign_up": "Viewcall  | Crear cuenta",
    };

    // Busca el título correspondiente o usa uno por defecto
    document.title = titles[location.pathname] || "Leaderflix | Plataforma de entretenimiento";
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign_in");
  };


  useEffect(() => {
    if (!shortcutsEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const altOrCmd = isMac ? e.metaKey : e.altKey;

      if (altOrCmd && e.key.toLowerCase() === "h") {
        e.preventDefault();
        navigate("/home");
      } else if (altOrCmd && e.key.toLowerCase() === "p") {
        e.preventDefault();
        navigate("/profile");
      } else if (altOrCmd && e.key.toLowerCase() === "a") {
        e.preventDefault();
        navigate("/about");
      } else if (altOrCmd && e.key.toLowerCase() === "m") {
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
      className="flex items-center gap-3 cursor-pointer relative group"
      aria-label="Ir al inicio de Leaderflix"
    >
      <img
        src="/viewcall-logo.png"
        alt="Logo de Viewcall"
        className="w-10 h-10 object-contain"
      />
      <div className="hidden sm:block">
        <h1 className="text-lg font-bold text-[#1a1a1a]">Viewcall</h1>
      </div>
    </Link>

    

    {/* Desktop Icons */}
    <div className="hidden md:flex items-center gap-3" role="menubar">

      <Link to="/profile" aria-label="Ir al perfil de usuario">
        <button className="p-2 bg-white border border-gray-300 rounded-full hover:bg-[#d6dbff] transition">
          <User size={18} className="text-[#1a1a1a]" />
        </button>
      </Link>

      {/* Toggle shortcuts */}
      <button
        onClick={toggleShortcuts}
        className={`p-2 rounded-full border ${
          shortcutsEnabled
            ? "bg-green-500 text-white border-green-600"
            : "bg-white border-gray-300 text-gray-600"
        } hover:opacity-90 transition`}
        aria-pressed={shortcutsEnabled}
      >
        <Keyboard size={18} />
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition"
        aria-label="Cerrar sesión"
      >
        <LogOut size={18} />
      </button>
    </div>

    {/* Mobile Button */}
    <button
      className="p-2 text-[#1a1a1a] md:hidden"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-label="Abrir menú móvil"
    >
      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="md:hidden bg-white border-t border-gray-300 shadow-lg" role="menu">
      <div className="flex flex-col gap-2 p-4">

        <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
          <button className="flex items-center gap-3 w-full text-gray-800 py-3 px-4 rounded-lg hover:bg-[#eef1ff] transition">
            <User size={18} /> Perfil
          </button>
        </Link>

        <button
          onClick={toggleShortcuts}
          className="flex items-center gap-3 w-full text-gray-800 py-3 px-4 rounded-lg hover:bg-[#eef1ff] transition"
        >
          <Keyboard size={18} /> Atajos del sistema
        </button>

        <button
          onClick={() => {
            setIsMenuOpen(false);
            handleLogout();
          }}
          className="flex items-center gap-3 w-full text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition"
        >
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </div>
  )}
</nav>

  );
}
