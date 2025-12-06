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

  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // Generate unique peer ID for voice
  const peerId = `${username}-${Date.now()}`;

  // Voice hook
  const {
    micOn,
    toggleMic,
  } = useVoice({
    roomId: roomId!,
    userInfo: {
      userId: username,
      displayName: username,
      peerId,
    },
    micEnabled: true,
  });

  return (
    <div className="min-h-screen bg-[#e8ecf7] text-white flex flex-col">
      <Navbar />

      <div className="mt-4 flex flex-col items-center gap-3 bg-white text-black p-4 rounded-xl shadow-md">
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

      <div className="flex flex-1 p-6 gap-6">
        <VideoArea
          micOn={micOn}
          cameraOn={cameraOn}
          screenSharing={screenSharing}
        />

        <div className="w-80 flex flex-col gap-4">
          {isChatOpen && <ChatPanel roomId={roomId!} username={username} />}
          {isParticipantsOpen && (
            <ParticipantsPanel roomId={roomId!} username={username} />
          )}
        </div>
      </div>

      <ControlBar
        micOn={micOn}
        setMicOn={toggleMic}
        cameraOn={cameraOn}
        setCameraOn={setCameraOn}
        screenSharing={screenSharing}
        setScreenSharing={setScreenSharing}
        setIsChatOpen={setIsChatOpen}
        setIsParticipantsOpen={setIsParticipantsOpen}
        onToggleMic={toggleMic}
      />
    </div>
  );
}
