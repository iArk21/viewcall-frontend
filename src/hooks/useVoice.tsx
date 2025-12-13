import { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";

// URLs and credentials for WebRTC and ICE servers
const serverWebRTCUrl = import.meta.env.VITE_WEBRTC_URL;
const iceServerUrl = import.meta.env.VITE_ICE_SERVER_URL;
const iceServerUsername = import.meta.env.VITE_ICE_SERVER_USERNAME;
const iceServerCredential = import.meta.env.VITE_ICE_SERVER_CREDENTIAL;

interface UserInfo {
  userId: string;
  displayName: string;
  peerId: string;
}

interface UseVoiceProps {
  roomId: string;
  userInfo: UserInfo;
  micEnabled?: boolean;
  cameraEnabled?: boolean;
}

interface PeerInstance extends Peer.Instance {
  // Add any custom properties if needed, otherwise Peer.Instance covers it
}

interface PeersMap {
  [key: string]: {
    peerConnection: PeerInstance;
  };
}

export default function useVoice({ roomId, micEnabled = true, cameraEnabled = true }: UseVoiceProps) {
  const [micOn, setMicOn] = useState(micEnabled);
  const [cameraOn, setCameraOn] = useState(cameraEnabled);
  const cameraOnRef = useRef(cameraEnabled); // Ref to track desired camera state
  const [screenSharing, setScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<PeersMap>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  // Sync ref with state
  useEffect(() => {
    cameraOnRef.current = cameraOn;
  }, [cameraOn]);

  // Helper to create audio elements (kept from original logic)
  const createClientMediaElements = (peerId: string) => {
    const existingAudio = document.getElementById(`${peerId}_audio`);
    if (existingAudio) return;

    const audioEl = document.createElement("audio");
    audioEl.id = `${peerId}_audio`;
    audioEl.controls = false;
    audioEl.volume = 1;
    document.body.appendChild(audioEl);

    audioEl.addEventListener("loadeddata", () => {
      audioEl.play().catch((e) => console.error("Error playing audio:", e));
    });
  };

  const updateClientMediaElements = (peerId: string, stream: MediaStream) => {
    const audioEl = document.getElementById(`${peerId}_audio`) as HTMLAudioElement;
    if (audioEl) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioEl.srcObject = new MediaStream([audioTrack]);
        audioEl.play().catch((e) => console.error("Error playing audio stream:", e));
      }
    }
  };

  const removeClientAudioElement = (peerId: string) => {
    const audioEl = document.getElementById(`${peerId}_audio`);
    if (audioEl) {
      audioEl.remove();
    }
  };

  const getIceServers = () => {
    const iceServers: RTCIceServer[] = [];

    if (iceServerUrl) {
      const urls = iceServerUrl
        .split(",")
        .map((url: string) => url.trim())
        .filter(Boolean)
        .map((url: string) => {
          if (!/^stun:|^turn:|^turns:/.test(url)) {
            return `turn:${url}`;
          }
          return url;
        });

      urls.forEach((url: string) => {
        const serverConfig: RTCIceServer = { urls: url };
        if (iceServerUsername) {
          serverConfig.username = iceServerUsername;
        }
        if (iceServerCredential) {
          serverConfig.credential = iceServerCredential;
        }
        iceServers.push(serverConfig);
      });
    }

    if (!iceServers.length) {
      iceServers.push({ urls: "stun:stun.l.google.com:19302" });
    } else {
      // Ensure there is at least one TURN server if possible, or fallback/add STUN
      // Original logic check:
      const hasTurn = iceServers.some((server) => {
        const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
        return urls.some((url) => url.startsWith("turn:") || url.startsWith("turns:"));
      });
      if (!hasTurn) {
        iceServers.push({ urls: "stun:stun.l.google.com:19302" });
      }
    }
    return iceServers;
  };

  const createPeerConnection = (theirSocketId: string, isInitiator = false, socket: Socket) => {
    const peerConnection = new Peer({
      initiator: isInitiator,
      config: {
        iceServers: getIceServers(),
      },
    }) as PeerInstance;

    peerConnection.on("signal", (data) => {
      socket.emit("signal", theirSocketId, socket.id, data);
    });

    peerConnection.on("connect", () => {
      // Add local stream to peer connection
      if (localStreamRef.current) {
        peerConnection.addStream(localStreamRef.current);
      }
    });

    peerConnection.on("stream", (stream) => {
      setRemoteStreams(prev => ({ ...prev, [theirSocketId]: stream }));
      updateClientMediaElements(theirSocketId, stream);
    });

    peerConnection.on("error", (err) => {
      // Ignore benign errors from closing connections
      if (err.message && err.message.includes("User-Initiated Abort")) return;
      console.error("Peer connection error:", err);
    });

    return peerConnection;
  };

  useEffect(() => {
    let myStream: MediaStream | null = null;
    let mySocket: Socket | null = null;
    let myPeers: PeersMap = {};
    let isMounted = true;

    async function init() {
      if (!Peer.WEBRTC_SUPPORT) {
        console.warn("WebRTC is not supported in this browser.");
        return;
      }

      try {
        // 1. Get User Media
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        if (!isMounted) {
          // If unmounted while waiting for user media, stop stream immediately
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        myStream = stream;
        localStreamRef.current = stream;
        setLocalStream(stream);

        if (!micEnabled) {
          stream.getTracks().forEach(track => track.enabled = false);
        }

        if (!cameraEnabled) {
          stream.getVideoTracks().forEach(track => track.enabled = false);
        }

        // 2. Connect Socket
        mySocket = io(serverWebRTCUrl);
        socketRef.current = mySocket;

        // Use local variable 'mySocket' for listeners to avoid closure staleness (though strictly not needed if we rely on isMounted logic, but good practice)
        mySocket.on("introduction", (otherClientIds: string[]) => {
          otherClientIds.forEach((theirId) => {
            if (theirId !== mySocket?.id) {
              const peer = createPeerConnection(theirId, true, mySocket!);
              myPeers[theirId] = { peerConnection: peer };
              peersRef.current[theirId] = { peerConnection: peer }; // Keep ref synced
              createClientMediaElements(theirId);
            }
          });
        });

        mySocket.on("newUserConnected", (theirId: string) => {
          if (theirId !== mySocket?.id && !(theirId in myPeers)) {
            myPeers[theirId] = {} as any;
            peersRef.current[theirId] = {} as any;
            createClientMediaElements(theirId);
          }
        });

        mySocket.on("userDisconnected", (_id: string) => {
          if (_id !== mySocket?.id) {
            removeClientAudioElement(_id);
            setRemoteStreams(prev => { const newR = { ...prev }; delete newR[_id]; return newR; });
            if (myPeers[_id]?.peerConnection) {
              myPeers[_id].peerConnection.destroy();
            }
            delete myPeers[_id];
            delete peersRef.current[_id];
          }
        });

        mySocket.on("signal", (to: string, from: string, data: any) => {
          if (to !== mySocket?.id) return;

          let peerObj = myPeers[from];
          if (peerObj && peerObj.peerConnection) {
            peerObj.peerConnection.signal(data);
          } else {
            // Create receive-only peer
            const peerConnection = createPeerConnection(from, false, mySocket!);
            myPeers[from] = { peerConnection };
            peersRef.current[from] = { peerConnection };
            peerConnection.signal(data);
          }
        });

      } catch (error) {
        console.error("Failed to initialize WebRTC:", error);
      }
    }

    // Initialize
    init();

    return () => {
      isMounted = false;

      if (mySocket) {
        mySocket.disconnect();
        mySocket = null;
      }

      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
        myStream = null;
      }

      // Cleanup peers created in this effect
      Object.keys(myPeers).forEach((peerId) => {
        const p = myPeers[peerId];
        if (p.peerConnection) p.peerConnection.destroy();
        removeClientAudioElement(peerId);
      });
      myPeers = {};

      // Also clear refs to be safe, though they might be overwritten by next effect
      socketRef.current = null;
      localStreamRef.current = null;
      peersRef.current = {};
    };
  }, [roomId]);

  const toggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        // Toggle enabled state
        const newState = !micOn;
        audioTracks.forEach((track) => {
          track.enabled = newState;
        });
        setMicOn(newState);
      }
    }
  }, [micOn]);

  const toggleCamera = useCallback(() => {
    // Determine new state
    const newState = !cameraOn;
    setCameraOn(newState);

    // If we are sharing screen, do NOT touch the video track of the current stream,
    // because that video track IS the screen, and we don't want to turn off the screen.
    // We just update the state so that when screen sharing stops, we know what to restore.
    if (screenSharing) {
      return;
    }

    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach((track) => {
          track.enabled = newState;
        });
      }
    }
  }, [cameraOn, screenSharing]);

  /* 
   * Stops screen sharing and reverts to camera.
   * This function is defined outside to be stable or used inside `toggleScreenShare`.
   * However, since it largely depends on state/refs that are in scope, we define it here.
   */
  const stopScreenSharing = useCallback(async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = cameraStream.getVideoTracks()[0];

      // Restore the enabled/disabled state based on user preference
      videoTrack.enabled = cameraOnRef.current;

      const audioTrack = localStreamRef.current?.getAudioTracks()[0];
      const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];

      const newStream = new MediaStream([audioTrack, videoTrack].filter(Boolean) as MediaStreamTrack[]);
      localStreamRef.current = newStream;
      setLocalStream(newStream);

      // Update peers
      Object.values(peersRef.current).forEach(({ peerConnection }) => {
        if (!peerConnection.connected) return;
        if (oldVideoTrack) {
          try {
            peerConnection.replaceTrack(oldVideoTrack, videoTrack, newStream);
          } catch (err) {
            console.warn("Failed to replace track for peer (attempting fallback):", err);
            try {
              (peerConnection as any).addTrack(videoTrack, newStream);
            } catch (addErr) {
              console.error("Fallback addTrack failed:", addErr);
            }
          }
        } else {
          try {
            (peerConnection as any).addTrack(videoTrack, newStream);
          } catch (e) {
            console.error("Error adding track:", e);
          }
        }
      });

      // Stop the screen share track (if it's not already stopped)
      // Note: If this was triggered by 'onended', the track is already "ended", 
      // but calling stop() is safe/idempotent usually, or we can check readyState.
      if (oldVideoTrack && oldVideoTrack.readyState !== "ended") {
        oldVideoTrack.stop();
      }

      setScreenSharing(false);
    } catch (e: any) {
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") return;
      console.error("Error switching back to camera:", e);
    }
  }, []);

  const startScreenSharing = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const videoTrack = screenStream.getVideoTracks()[0];
      const audioTrack = localStreamRef.current?.getAudioTracks()[0];
      const oldVideoTrack = localStreamRef.current?.getVideoTracks()[0];

      const newStream = new MediaStream([audioTrack, videoTrack].filter(Boolean) as MediaStreamTrack[]);
      localStreamRef.current = newStream;
      setLocalStream(newStream);

      // Update peers
      Object.values(peersRef.current).forEach(({ peerConnection }) => {
        if (!peerConnection.connected) return;
        if (oldVideoTrack) {
          try {
            peerConnection.replaceTrack(oldVideoTrack, videoTrack, newStream);
          } catch (err) {
            console.warn("Failed to replace track for peer (attempting fallback):", err);
            try {
              (peerConnection as any).addTrack(videoTrack, newStream);
            } catch (addErr) {
              console.error("Fallback addTrack failed:", addErr);
            }
          }
        } else {
          try {
            (peerConnection as any).addTrack(videoTrack, newStream);
          } catch (e) {
            console.error("Error adding track:", e);
          }
        }
      });

      // Stop the camera track
      oldVideoTrack?.stop();

      // IMPORTANT: When the user clicks "Stop sharing" in the browser native UI,
      // this event fires. We MUST call stopScreenSharing() explicitly here.
      // Do NOT call toggleScreenShare() because that might rely on stale state closure
      // if not careful, and strict separation is cleaner.
      videoTrack.onended = () => {
        stopScreenSharing();
      };

      setScreenSharing(true);
    } catch (e: any) {
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") return;
      console.error("Error sharing screen:", e);
    }
  }, [stopScreenSharing]);

  const toggleScreenShare = useCallback(async () => {
    if (screenSharing) {
      await stopScreenSharing();
    } else {
      await startScreenSharing();
    }
  }, [screenSharing, stopScreenSharing, startScreenSharing]);

  useEffect(() => {
    // Sync micEnabled prop with state if it changes externally?
    // Or just respect initial.
    // MeetingRoom passes `micEnabled: true` and also passes `micOn` back to UI.
    // We'll trust internal state `micOn`.
  }, []);

  return {
    micOn,
    toggleMic,
    cameraOn,
    toggleCamera,
    screenSharing,
    toggleScreenShare,
    localStream,
    remoteStreams,
  };
}
