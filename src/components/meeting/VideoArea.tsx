


interface VideoAreaProps {
  micOn: boolean;
  cameraOn: boolean;
  screenSharing: boolean;
}

const VideoArea = ({ micOn, cameraOn, screenSharing }: VideoAreaProps) => {
  return (
    <div className="flex-1 bg-black rounded-2xl relative overflow-hidden">

      {/* Simulación de video */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
        {cameraOn ? "🎥 Cámara activa" : "📷 Cámara apagada"}
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
