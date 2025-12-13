import { useEffect, useRef } from "react";

interface VideoAreaProps {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  localStream: MediaStream | null;
  remoteStreams: { [key: string]: MediaStream };
}

const VideoPlayer = ({ stream, isLocal }: { stream: MediaStream; isLocal: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch((e) => {
        if (e.name !== "AbortError") {
          console.error("Error playing video:", e);
        }
      });
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      muted={isLocal}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />
  );
};

const VideoArea = ({ micOn, cameraOn, screenSharing, localStream, remoteStreams }: VideoAreaProps) => {
  return (
    <div className="flex-1 bg-black rounded-2xl relative overflow-hidden p-4 h-full">

      <div
        className="grid gap-4 h-full"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gridAutoRows: "1fr",
        }}
      >
        {localStream && (cameraOn || screenSharing) && (
          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
            <VideoPlayer stream={localStream} isLocal />
            <div className="absolute bottom-2 left-2 text-white text-sm">Tú</div>
          </div>
        )}

        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div
            key={id}
            className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video"
          >
            <VideoPlayer stream={stream} isLocal={false} />
            <div className="absolute bottom-2 left-2 text-white text-sm">
              Participante
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-0 w-full bg-black/40 py-3 px-4 flex justify-center gap-4">
        <div className={`w-3 h-3 rounded-full ${micOn ? "bg-green-500" : "bg-red-500"}`} />
        <div className={`w-3 h-3 rounded-full ${cameraOn ? "bg-green-500" : "bg-red-500"}`} />
        <div className={`w-3 h-3 rounded-full ${screenSharing ? "bg-blue-500" : "bg-gray-500"}`} />
      </div>

      {/* Timer */}
      <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-xl">
        ⏱ 00:00
      </div>
    </div>
  );
};

export default VideoArea;
