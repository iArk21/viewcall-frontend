interface VideoAreaProps {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
  localStream: MediaStream | null;
  remoteStreams: {[key: string]: MediaStream};
}

const VideoArea = ({ micOn, cameraOn, screenSharing, localStream, remoteStreams }: VideoAreaProps) => {
  return (
    <div className="flex-1 bg-black rounded-2xl relative overflow-hidden p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {localStream && cameraOn && (
          <div className="relative bg-gray-800 rounded-xl overflow-hidden">
            <video
              ref={(video) => {
                if (video && localStream) {
                  video.srcObject = localStream;
                  video.play().catch((e) => console.error("Error playing local video:", e));
                }
              }}
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-sm">Tú</div>
          </div>
        )}
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div key={id} className="relative bg-gray-800 rounded-xl overflow-hidden">
            <video
              ref={(video) => {
                if (video && stream) {
                  video.srcObject = stream;
                  video.play().catch((e) => console.error("Error playing remote video:", e));
                }
              }}
              autoPlay
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-sm">Participante</div>
          </div>
        ))}
      </div>

      {/* Indicadores inferiores */}
      <div className="absolute bottom-0 w-full bg-black/40 py-3 px-4 flex justify-center gap-4">
        <div className={`w-3 h-3 rounded-full ${micOn ? "bg-green-500" : "bg-red-500"}`} />
        <div className={`w-3 h-3 rounded-full ${cameraOn ? "bg-green-500" : "bg-red-500"}`} />
        <div className={`w-3 h-3 rounded-full ${screenSharing ? "bg-blue-500" : "bg-gray-500"}`} />
      </div>

      {/* Temporizador */}
      <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-xl flex items-center gap-2">
        ⏱ <span>00:00</span>
      </div>
    </div>
  );
};

export default VideoArea;
