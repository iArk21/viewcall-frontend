import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

import VideoArea from "../components/meeting/VideoArea";
import ChatPanel from "../components/meeting/ChatPanel";
import ParticipantsPanel from "../components/meeting/ParticipantsPanel";
import ControlBar from "../components/meeting/ControlBar";
import useVoice from "../hooks/useVoice";

export default function MeetingRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();

  const username =
    location.state?.username ||
    localStorage.getItem("userName") ||
    "Invitado";

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);

  const peerId = `${username}-${Date.now()}`;

  const {
    micOn,
    toggleMic,
    cameraOn,
    toggleCamera,
    screenSharing,
    toggleScreenShare,
    localStream,
    remoteStreams,
  } = useVoice({
    roomId: roomId!,
    userInfo: {
      userId: username,
      displayName: username,
      peerId,
    },
    micEnabled: true,
    cameraEnabled: true,
  });

  return (
    <div
      className="h-screen fixed inset-0 overflow-hidden bg-[#e8ecf7] text-white flex flex-col"
      role="document"
      aria-label="Sala de videollamada ViewCall"
    >
      {/* NAVBAR */}
      <header role="banner" aria-label="Barra de navegación principal">
        <Navbar />
      </header>

      {/* MEETING INFO */}
      <section
        className="mt-4 flex flex-col items-center gap-3 bg-white text-black p-4 rounded-xl shadow-md flex-shrink-0"
        aria-labelledby="meeting-code-title"
      >
        <h1 id="meeting-code-title" className="font-semibold text-lg">
          Código de reunión:
          <span className="tracking-wider ml-2">{roomId}</span>
        </h1>

        <button
          onClick={() => {
            navigator.clipboard.writeText(roomId || "");
            alert("Código copiado al portapapeles ✓");
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
          aria-label="Copiar código de la reunión al portapapeles"
        >
          Copiar código
        </button>
      </section>

      {/* MAIN CONTENT */}
      <main
        className="flex flex-1 p-4 lg:p-6 gap-6 relative overflow-hidden flex-col lg:flex-row"
        role="main"
        aria-label="Área principal de la videollamada"
      >
        {/* VIDEO AREA */}
        <section
          className="flex-1 flex flex-col min-h-0"
          aria-label="Área de transmisión de video"
        >
          <VideoArea
            micOn={micOn}
            cameraOn={cameraOn}
            screenSharing={screenSharing}
            localStream={localStream}
            remoteStreams={remoteStreams}
          />
        </section>

        {/* SIDE PANELS */}
        {(isChatOpen || isParticipantsOpen) && (
          <aside
            className={`
              fixed inset-0 z-50 bg-[#e8ecf7] p-4 flex flex-col gap-4
              lg:static lg:w-80 lg:bg-transparent lg:p-0 lg:z-auto
            `}
            role="complementary"
            aria-label="Panel lateral de chat y participantes"
          >
            {/* MOBILE CLOSE */}
            <div className="flex justify-end lg:hidden mb-2">
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                }}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                aria-label="Cerrar panel lateral"
              >
                ✕ Cerrar
              </button>
            </div>

            {isChatOpen && (
              <section aria-label="Panel de chat de la reunión" className="flex-1 min-h-0 flex flex-col">
                <ChatPanel
                  roomId={roomId!}
                  username={username}
                  onClose={() => setIsChatOpen(false)}
                />
              </section>
            )}

            {isParticipantsOpen && (
              <section aria-label="Panel de participantes de la reunión" className="flex-1 min-h-0 flex flex-col">
                <ParticipantsPanel
                  roomId={roomId!}
                  username={username}
                />
              </section>
            )}
          </aside>
        )}
      </main>

      {/* CONTROL BAR */}
      <nav
        role="navigation"
        aria-label="Controles de la videollamada"
      >
        <ControlBar
          micOn={micOn}
          setMicOn={toggleMic}
          cameraOn={cameraOn}
          setCameraOn={toggleCamera}
          screenSharing={screenSharing}
          setScreenSharing={toggleScreenShare}
          setIsChatOpen={setIsChatOpen}
          setIsParticipantsOpen={setIsParticipantsOpen}
          onToggleMic={toggleMic}
        />
      </nav>
    </div>
  );
}
