/**
 * Navbar Component
 *
 * This component renders the main navigation bar for the application.
 * It includes routing, keyboard shortcuts, mobile responsiveness,
 * page title updates, and accessible navigation controls.
 *
 * Features:
 * - Dynamic page titles based on route
 * - Keyboard shortcuts toggle (saved in localStorage)
 * - Responsive navigation (desktop & mobile)
 * - Logout button
 * - Navigation menu with icons using Lucide React
 */

import { User, LogOut, Menu, X, Keyboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Controls the visibility of the mobile navigation menu.
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Determines whether keyboard shortcuts are enabled.
   * Saved and loaded from localStorage.
   */
  const [shortcutsEnabled, setShortcutsEnabled] = useState(() => {
    return localStorage.getItem("shortcutsEnabled") === "true";
  });

  /**
   * Updates the browser tab title depending on the current route.
   * Follows WCAG requirement 2.4.2 for accessible page titles.
   */
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
      titles[location.pathname] ||
      "Leaderflix | Entertainment Platform";
  }, [location.pathname]);

  /**
   * Logs out the user by removing the token and redirecting to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign_in");
  };

  /**
   * Enables global keyboard shortcuts for navigation when activated.
   * Shortcuts vary between macOS (Command) and Windows/Linux (Alt).
   */
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

  /**
   * Toggles system-wide keyboard shortcuts and persists the state in localStorage.
   */
  const toggleShortcuts = () => {
    const newState = !shortcutsEnabled;
    setShortcutsEnabled(newState);
    localStorage.setItem("shortcutsEnabled", String(newState));
  };

  return (
    <nav
      className="bg-[#eef1ff] text-[#1a1a1a] relative shadow-md"
      role="navigation"
      aria-label="Main navigation bar"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4">

        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center gap-3 cursor-pointer group"
          aria-label="Go to Viewcall homepage"
        >
          <img
            src="/viewcall-logo.png"
            alt="Viewcall logo"
            className="w-10 h-10 object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-[#1a1a1a]">Viewcall</h1>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3" role="menubar">

          {/* User Profile */}
          <Link to="/profile" aria-label="Go to user profile">
            <button className="p-2 bg-white border border-gray-300 rounded-full hover:bg-[#d6dbff] transition">
              <User size={18} className="text-[#1a1a1a]" />
            </button>
          </Link>

          {/* Toggle Keyboard Shortcuts */}
          <button
            onClick={toggleShortcuts}
            aria-pressed={shortcutsEnabled}
            className={`p-2 rounded-full border ${
              shortcutsEnabled
                ? "bg-green-500 text-white border-green-600"
                : "bg-white border-gray-300 text-gray-600"
            } hover:opacity-90 transition`}
          >
            <Keyboard size={18} />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 text-[#1a1a1a] md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Open mobile menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-300 shadow-lg" role="menu">
          <div className="flex flex-col gap-2 p-4">

            {/* Profile */}
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              <button className="flex items-center gap-3 w-full text-gray-800 py-3 px-4 rounded-lg hover:bg-[#eef1ff] transition">
                <User size={18} /> Profile
              </button>
            </Link>

            {/* Shortcuts */}
            <button
              onClick={toggleShortcuts}
              className="flex items-center gap-3 w-full py-3 px-4 text-gray-800 rounded-lg hover:bg-[#eef1ff] transition"
            >
              <Keyboard size={18} /> System Shortcuts
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full py-3 px-4 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
