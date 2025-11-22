import { useParams } from "react-router-dom";
import { Mic, Video, Monitor, Users, MessageCircle, PhoneOff } from "lucide-react";
import Navbar from "../components/Navbar";


export default function MeetingRoom() {
  const {  } = useParams();

  return (
    <div className="min-h-screen bg-[#131820] text-white flex flex-col">
        <Navbar />

      {/* Área principal */}
      <div className="flex flex-1 p-6">

        {/* Video grande */}
        <div className="flex-1 bg-black rounded-2xl relative overflow-hidden">
          

          {/* Timer */}
          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-xl flex items-center gap-2">
            ⏱ <span>45:23</span>
          </div>
        </div>

        {/* Lista participantes */}
        <div className="w-60 ml-6 flex flex-col justify-start gap-4">
          {["p1", "p2", "p3"].map((p) => (
            <div key={p} className="bg-[#20242E] rounded-xl h-24 flex items-center justify-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                {p}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Barra inferior */}
      <div className="bg-[#20242E] py-4 flex justify-center gap-6 border-t border-white/10">

        <button className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center">
          <Mic />
        </button>

        <button className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center">
          <Video />
        </button>

        <button className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center">
          <Monitor />
        </button>

        <button className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center">
          <Users />
        </button>

        <button className="w-14 h-14 rounded-full bg-[#161A21] flex items-center justify-center">
          <MessageCircle />
        </button>

        <button className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
          <PhoneOff />
        </button>
      </div>
    </div>
  );
}
