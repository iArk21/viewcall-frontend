import { 
  Mic, 
  Video, 
  Monitor, 
  Users, 
  MessageCircle, 
  PhoneOff 
} from "lucide-react";

import { useNavigate } from "react-router-dom";

interface Props {
  micOn: boolean;
  setMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  cameraOn: boolean;
  setCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
  screenSharing: boolean;
  setScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsParticipantsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  /** 
   *  callback opcional para conectarlo con WebRTC/backend 
   *  ej: socket.emit("mic:update", micOn)
   */
  onToggleMic?: (enabled: boolean) => void;
}

const ControlBar = ({
  micOn,
  setMicOn,
  cameraOn,
  setCameraOn,
  screenSharing,
  setScreenSharing,
  setIsChatOpen,
  setIsParticipantsOpen,
  onToggleMic,
}: Props) => {
  
  const navigate = useNavigate();

  // Lógica para colgar la llamada
  const handleLeaveCall = () => {
    // aquí podrás emitir al backend un "leave:room" si lo necesitas
    // socket.emit("leave:room", roomId);

    navigate("/home"); // <-- vuelve al home
  };

  // Botón de micrófono preparado para WebRTC / backend
  const toggleMic = () => {
    const newValue = !micOn;
    setMicOn(newValue);

    if (onToggleMic) onToggleMic(newValue); // <-- preparado para emitir evento
  };

  return (
    <div className="bg-[#20242E] py-4 flex justify-center gap-6 border-t border-white/10">
      
      {/* Mic */}
      <button
        onClick={toggleMic}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Mic 
          className={micOn ? "text-white" : "text-red-500"} 
        />
      </button>

      {/* Cámara */}
      <button
        onClick={() => setCameraOn(!cameraOn)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Video />
      </button>

      {/* Compartir pantalla */}
      <button
        onClick={() => setScreenSharing(!screenSharing)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Monitor />
      </button>

      {/* Participantes */}
      <button
        onClick={() => setIsParticipantsOpen((s) => !s)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Users />
      </button>

      {/* Chat */}
      <button
        onClick={() => setIsChatOpen((s) => !s)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <MessageCircle />
      </button>

      {/* Colgar */}
      <button
        onClick={handleLeaveCall}
        className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center"
      >
        <PhoneOff />
      </button>
    </div>
  );
};

export default ControlBar;
