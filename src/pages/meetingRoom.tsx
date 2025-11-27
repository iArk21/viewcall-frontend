import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

import VideoArea from "../components/meeting/VideoArea";
import ChatPanel from "../components/meeting/ChatPanel";
import ParticipantsPanel from "../components/meeting/ParticipantsPanel";
import ControlBar from "../components/meeting/ControlBar";

/**
 * MeetingRoom Page (Sprint 2)
 *
 * - Recibe el ID de la reunión desde la URL
 * - Administra la UI completa de la reunión
 * - Define estados globales del room (mic, cámara, chat, participantes)
 * - Contiene la estructura visual principal
 */

export default function MeetingRoom() {
  const { meetingId } = useParams<{ meetingId: string }>();

  // Estados UI para Sprint 2
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  return (
    <div className="min-h-screen bg-[#131820] text-white flex flex-col">
      <Navbar />

      {/* ID de reunión arriba (Sprint 2 requirement) */}
      <div className="px-6 pt-3 text-sm opacity-70">
        Código de reunión: <span className="font-semibold">{meetingId}</span>
      </div>

      <div className="flex flex-1 p-6 gap-6">
        {/* VIDEO AREA */}
        <VideoArea
          micOn={micOn}
          cameraOn={cameraOn}
          screenSharing={screenSharing}
        />

        {/* RIGHT SIDEBAR */}
        <div className="w-80 flex flex-col gap-4">
          {isChatOpen && <ChatPanel />}
          {isParticipantsOpen && <ParticipantsPanel />}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <ControlBar
        micOn={micOn}
        setMicOn={setMicOn}
        cameraOn={cameraOn}
        setCameraOn={setCameraOn}
        screenSharing={screenSharing}
        setScreenSharing={setScreenSharing}
        setIsChatOpen={setIsChatOpen}
        setIsParticipantsOpen={setIsParticipantsOpen}
      />
    </div>
  );
}
