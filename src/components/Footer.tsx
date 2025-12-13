import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export default function Footer() {
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

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
      {/* MAIN FOOTER */}
      <footer
        className="mt-auto bg-white/70 backdrop-blur border-t border-gray-200"
        role="contentinfo"
        aria-label="Pie de página de la aplicación"
      >
        <div className="w-full max-w-5xl mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">

          {/* BRAND */}
          <section aria-label="Información de la plataforma">
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              <Film size={16} className="text-blue-600" aria-hidden="true" />
              <h3 className="text-gray-800 font-semibold text-sm">
                Viewcall
              </h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto md:mx-0">
              Viewcall proyecto académico.
            </p>
          </section>

          {/* NAVIGATION */}
          <nav aria-label="Navegación del pie de página">
            <h4 className="text-gray-700 font-semibold text-xs mb-2">
              Navegación
            </h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>
                <Link to="/home" aria-label="Ir a inicio">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/profile" aria-label="Ir al perfil de usuario">
                  Perfil
                </Link>
              </li>
              <li>
                <Link to="/create-meeting" aria-label="Crear una reunión">
                  Crear reunión
                </Link>
              </li>
              <li>
                <Link to="/about" aria-label="Ver información sobre el proyecto">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </nav>

          {/* HELP */}
          <section aria-label="Sección de ayuda y accesibilidad">
            <h4 className="text-gray-700 font-semibold text-xs mb-2">
              Ayuda
            </h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>
              <a
                  href="/manual-de-usuario.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir manual de usuario en formato PDF"
                >
                  Manual de usuario
                </a>
              </li>

              <li>
                <button
                  onClick={() => setShowAccessibilityModal(true)}
                  aria-label="Abrir información de accesibilidad"
                  className="hover:text-blue-600"
                >
                  Accesibilidad
                </button>
              </li>
            </ul>
          </section>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-200 py-2">
          <p className="text-center text-[10px] text-gray-500">
            © {new Date().getFullYear()} Viewcall — Proyecto Académico
          </p>
          <p className="text-center text-[10px] text-gray-400">
            Universidad del Valle · Proyecto Integrador I
          </p>
        </div>
      </footer>

      {/* ACCESSIBILITY MODAL */}
      {showAccessibilityModal && (
        <Modal
          title="Atajos de accesibilidad"
          onClose={() => setShowAccessibilityModal(false)}
        >
          <p className="text-gray-300 text-sm mb-3">
            Atajos de teclado disponibles para navegar en la aplicación:
          </p>

          <ul className="text-gray-200 text-sm space-y-2">
            <li><strong>Alt + H</strong> — Ir a Inicio</li>
            <li><strong>Alt + P</strong> — Ir a Perfil</li>
            <li><strong>Alt + A</strong> — Ir a Acerca de</li>
          </ul>
        </Modal>
      )}
    </>
  );
}

/* MODAL ACCESIBLE */
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
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-gray-900 rounded-2xl p-6 w-[90%] max-w-lg shadow-xl">
        <header className="flex justify-between items-center mb-4">
          <h3
            id="modal-title"
            className="text-white text-lg font-semibold"
          >
            {title}
          </h3>

          <button
            onClick={onClose}
            aria-label="Cerrar ventana de accesibilidad"
            className="text-gray-400 hover:text-red-400 text-xl"
          >
            ×
          </button>
        </header>

        {children}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg text-white text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
