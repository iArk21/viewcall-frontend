import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Film, BookOpen } from "lucide-react";

/**
 * Footer component for the Viewcall project.
 * Displays navigation links, branding information, and accessibility options.
 * Includes an accessibility shortcuts modal and listens for the ESC key to close it.
 *
 * @component
 */
export default function Footer() {
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  /**
   * Adds a global listener to close the modal using the "Escape" key.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAccessibilityModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Main Footer */}
      <footer className="mt-auto bg-white/70 backdrop-blur border-t border-gray-200">
        <div
          className="w-full max-w-5xl mx-auto px-6 py-4 
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 
          text-center md:text-left"
        >
          {/* BRAND SECTION */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Film size={16} className="text-blue-600" />
              <h3 className="text-gray-800 font-semibold text-sm">Viewcall</h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
             Viewcall proyecto academico.
            </p>
          </div>

          {/* NAVIGATION LINKS */}
          <div>
            <h4 className="text-gray-700 font-semibold text-xs mb-2">Navegación</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>
                <Link to="/home" className="hover:text-blue-600">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-600">
                  Perfil
                </Link>
              </li>
              <li>
                <Link to="/create-meeting" className="hover:text-blue-600">
                  Crear reunión
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* HELP SECTION */}
          <div>
            <h4 className="text-gray-700 font-semibold text-xs mb-2">Ayuda</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>
                <a
                  href="/docs/manual-de-usuario.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  Manual de usuario
                </a>
              </li>

              <li>
                <button
                  onClick={() => setShowAccessibilityModal(true)}
                  className="hover:text-blue-600"
                >
                  Accesibilidad
                </button>
              </li>

              <li>
                <Link
                  to="/sitemap"
                  className="hover:text-blue-600 flex items-center justify-center md:justify-start gap-1"
                >
                  <BookOpen size={12} />
                  Mapa del sitio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT TEXT */}
        <div className="border-t border-gray-200 py-2">
          <p className="text-center text-[10px] text-gray-500">
            © {new Date().getFullYear()} Viewcall — Proyecto Academico
          </p>
          <p className="text-center text-[10px] text-gray-400">
            Universidad del Valle · Proyecto Integrador 1
          </p>
        </div>
      </footer>

      {/* ACCESSIBILITY MODAL */}
      {showAccessibilityModal && (
        <Modal
          title="Accessibility Shortcuts"
          onClose={() => setShowAccessibilityModal(false)}
        >
          <p className="text-gray-300 text-sm leading-relaxed">
          Aquí puedes mostrar atajos de teclado, consejos de navegación, funciones de acceso rápido para los usuarios y más.
          </p>
        </Modal>
      )}
    </>
  );
}

/**
 * Reusable modal component.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Modal content.
 * @param {Function} props.onClose - Function triggered when the modal closes.
 * @param {string} props.title - Title displayed at the top of the modal.
 *
 * @component
 */
function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-lg shadow-xl relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <button
            className="text-gray-400 hover:text-red-400 text-xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        {children}

        {/* CLOSE BUTTON */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 transition px-4 py-1 rounded-lg text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
