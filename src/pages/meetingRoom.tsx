import { useParams } from "react-router-dom";
import {
  Mic,
  Video,
  Monitor,
  Users,
  MessageCircle,
  PhoneOff,
  SendHorizontal,
} from "lucide-react";
import Navbar from "../components/Navbar";

/**
 * Meeting Room Page
 *
 * This component represents the main video conferencing interface,
 * including the video area, chat panel, participants list, and
 * bottom control bar. It simulates the layout of a real meeting
 * room environment while still functioning as a static placeholder.
 *
 * @component
 * @returns {JSX.Element} The rendered meeting room UI.
 */
export default function MeetingRoom() {
  /**
   * Extract meeting parameters from the route.
   * Currently unused, but reserved for future functionality
   * such as loading a meeting by its ID.
   *
   * @type {Record<string, string | undefined>}
   */
  const {} = useParams();

  return (
    <div className="min-h-screen bg-[#131820] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 p-6 gap-6">
        {/* MAIN VIDEO AREA */}
        <div className="flex-1 bg-black rounded-2xl relative overflow-hidden">
          {/* Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
            🎥 Streaming loading…
          </div>

          {/* Fake video controls (bottom indicators) */}
          <div className="absolute bottom-0 w-full bg-black/40 py-3 px-4 flex justify-center gap-4">
            <div className="w-3 h-3 bg-gray-500 rounded-full opacity-60" />
            <div className="w-3 h-3 bg-gray-500 rounded-full opacity-60" />
            <div className="w-3 h-3 bg-gray-500 rounded-full opacity-60" />
          </div>

          {/* Timer */}
          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-xl flex items-center gap-2">
            ⏱ <span>00:00</span>
          </div>
        </div>

        {/* RIGHT SIDEBAR: CHAT + PARTICIPANTS */}
        <div className="w-80 flex flex-col gap-4">
          {/* CHAT PANEL */}
          <div className="flex-1 bg-[#20242E] rounded-xl p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-3">Chat</h2>

            {/**
             * Fake chat messages used only for UI visualization.
             * In future versions, this could be replaced by
             * a real-time chat system using WebSockets.
             */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              <div className="bg-[#161A21] p-3 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-white">Ana:</span> Hello
                  everyone 👋
                </p>
              </div>

              <div className="bg-[#161A21] p-3 rounded-lg">
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-white">Pedro:</span> Is the
                  meeting starting soon?
                </p>
              </div>
            </div>

            {/* Disabled Input Field (placeholder for future functionality) */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="text"
                disabled
                placeholder="Write a message..."
                className="flex-1 bg-[#161A21] px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <button className="bg-blue-600 p-2 rounded-lg opacity-60 cursor-not-allowed">
                <SendHorizontal />
              </button>
            </div>
          </div>

          {/* PARTICIPANTS LIST */}
          <div className="bg-[#20242E] rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3">Participants</h2>

            {/**
             * Static participants list.
             * Eventually, this could be replaced with live data
             * from the backend or WebRTC connections.
             */}
            <div className="flex flex-col gap-3">
              {["Ana", "Pedro", "Luis"].map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 bg-[#161A21] p-3 rounded-lg"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    {name[0]}
                  </div>
                  <p className="text-sm">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div className="bg-[#20242E] py-4 flex justify-center gap-6 border-t border-white/10">
        {/**
         * Control buttons (mic, camera, screen share, participants,
         * chat, and leave call). Currently static, but designed
         * to mirror the UI of real meeting platforms.
         */}
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

        {/* Leave meeting button */}
        <button className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
          <PhoneOff />
        </button>
      </div>
    </div>
  );
}
