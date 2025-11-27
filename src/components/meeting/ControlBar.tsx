import { Mic, Video, Monitor, Users, MessageCircle, PhoneOff } from "lucide-react";

interface Props {
  micOn: boolean;
  setMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  cameraOn: boolean;
  setCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
  screenSharing: boolean;
  setScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsParticipantsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
}: Props) => {
  return (
    <div className="bg-[#20242E] py-4 flex justify-center gap-6 border-t border-white/10">
      
      <button
        onClick={() => setMicOn(!micOn)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Mic />
      </button>

      <button
        onClick={() => setCameraOn(!cameraOn)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Video />
      </button>

      <button
        onClick={() => setScreenSharing(!screenSharing)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Monitor />
      </button>

      <button
        onClick={() => setIsParticipantsOpen((s) => !s)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <Users />
      </button>

      <button
        onClick={() => setIsChatOpen((s) => !s)}
        className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center"
      >
        <MessageCircle />
      </button>

      <button className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
        <PhoneOff />
      </button>
    </div>
  );
};

export default ControlBar;
