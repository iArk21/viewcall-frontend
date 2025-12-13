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

  // Obtener nombre desde JoinMeeting o localStorage
  const username =
    location.state?.username || localStorage.getItem("userName") || "Invitado";

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);

  // Generate unique peer ID for voice
  const peerId = `${username}-${Date.now()}`;

  // Voice hook
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
    <div className="h-screen fixed inset-0 overflow-hidden bg-[#e8ecf7] text-white flex flex-col">
      <Navbar />

      <div className="mt-4 flex flex-col items-center gap-3 bg-white text-black p-4 rounded-xl shadow-md flex-shrink-0">
        <div className="font-semibold text-lg">
          Código de reunión: <span className="tracking-wider">{roomId}</span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(roomId || "");
            alert("Código copiado al portapapeles ✓");
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
        >
          Copiar código
        </button>
      </div>

      <div className="flex flex-1 p-4 lg:p-6 gap-6 relative overflow-hidden flex-col lg:flex-row">
        <div className="flex-1 flex flex-col min-h-0">
          <VideoArea
            micOn={micOn}
            cameraOn={cameraOn}
            screenSharing={screenSharing}
            localStream={localStream}
            remoteStreams={remoteStreams}
          />
        </div>

        {/* Side Panel Container - Responsive */}
        {(isChatOpen || isParticipantsOpen) && (
          <div className={`
            fixed inset-0 z-50 bg-[#e8ecf7] p-4 flex flex-col gap-4
            lg:static lg:w-80 lg:bg-transparent lg:p-0 lg:z-auto
          `}>
            {/* Mobile Close Header - Only visible on mobile/overlay */}
            <div className="flex justify-end lg:hidden mb-2">
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                }}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                ✕ Cerrar
              </button>
            </div>

            {isChatOpen && (
              <ChatPanel
                roomId={roomId!}
                username={username}
                onClose={() => setIsChatOpen(false)}
              />
            )}
            {isParticipantsOpen && (
              <ParticipantsPanel
                roomId={roomId!}
                username={username}
              />
            )}
          </div>
        )}
      </div>

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
    </div>
  );
}
