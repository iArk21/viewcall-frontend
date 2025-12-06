import { useEffect, useRef, useState, useCallback } from "react";
import Peer from "peerjs";
import {
  connectVoiceSocket,
  disconnectVoiceSocket,
  joinVoiceRoom,
  toggleVoiceMic,
  onVoiceExistingUsers,
  onVoiceUserJoined,
  onVoiceUserLeft,
  onVoiceOffer,
  onVoiceAnswer,
  onVoiceIceCandidate,
  onVoiceMicUpdated,
  onVoiceRoomFull,
  onVoiceSocketConnect,
  onVoiceSocketDisconnect,
  onVoiceSocketError,
} from "../services/voiceSocket";
import type { VoiceUserInfo, VoiceParticipant } from "../services/voiceSocket";

/**
 * Custom hook for managing voice communication using WebRTC and PeerJS.
 * Handles peer connections, audio streams, and socket signaling.
 */
export default function useVoice({
  roomId,
  userInfo,
  micEnabled = true,
}: {
  roomId: string;
  userInfo: VoiceUserInfo;
  micEnabled?: boolean;
}) {
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [peerConnections, setPeerConnections] = useState<Map<string, any>>(new Map());
  const [audioStreams, setAudioStreams] = useState<Map<string, MediaStream>>(new Map());
  const [micOn, setMicOn] = useState(micEnabled);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // STUN server configuration
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  /**
   * Initializes local media stream (microphone).
   */
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      // Enable/disable audio track based on mic state
      stream.getAudioTracks().forEach(track => {
        track.enabled = micOn;
      });

      return stream;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      return null;
    }
  }, [micOn]);

  /**
   * Initializes PeerJS peer.
   */
  const initializePeer = useCallback(() => {
    const peer = new Peer(userInfo.peerId, {
      host: import.meta.env.VITE_VOICE_PEER_HOST || "localhost",
      port: Number(import.meta.env.VITE_VOICE_PEER_PORT) || 4000,
      path: import.meta.env.VITE_VOICE_PEER_PATH || "/peerjs",
      config: {
        iceServers,
      },
    });

    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("PeerJS connected with ID:", id);
    });

    peer.on("call", async (call) => {
      console.log("Incoming call from:", call.peer);

      const stream = localStreamRef.current || await initializeLocalStream();
      if (stream) {
        call.answer(stream);

        call.on("stream", (remoteStream) => {
          console.log("Received remote stream from:", call.peer);
          setAudioStreams(prev => new Map(prev.set(call.peer, remoteStream)));
        });

        call.on("close", () => {
          console.log("Call closed with:", call.peer);
          setAudioStreams(prev => {
            const newMap = new Map(prev);
            newMap.delete(call.peer);
            return newMap;
          });
          setPeerConnections(prev => {
            const newMap = new Map(prev);
            newMap.delete(call.peer);
            return newMap;
          });
        });

        call.on("error", (error) => {
          console.error("Call error:", error);
        });

        setPeerConnections(prev => new Map(prev.set(call.peer, call)));
      }
    });

    peer.on("error", (error) => {
      console.error("PeerJS error:", error);
    });

    return peer;
  }, [userInfo.peerId, iceServers, initializeLocalStream]);

  /**
   * Calls a remote peer.
   */
  const callPeer = useCallback(async (peerId: string) => {
    if (!peerRef.current || !localStreamRef.current) return;

    console.log("Calling peer:", peerId);

    const call = peerRef.current.call(peerId, localStreamRef.current);

    call.on("stream", (remoteStream) => {
      console.log("Received remote stream from:", peerId);
      setAudioStreams(prev => new Map(prev.set(peerId, remoteStream)));
    });

    call.on("close", () => {
      console.log("Call closed with:", peerId);
      setAudioStreams(prev => {
        const newMap = new Map(prev);
        newMap.delete(peerId);
        return newMap;
      });
      setPeerConnections(prev => {
        const newMap = new Map(prev);
        newMap.delete(peerId);
        return newMap;
      });
    });

    call.on("error", (error) => {
      console.error("Call error:", error);
    });

    setPeerConnections(prev => new Map(prev.set(peerId, call)));
  }, []);

  /**
   * Toggles microphone on/off.
   */
  const toggleMic = useCallback(() => {
    const newMicState = !micOn;
    setMicOn(newMicState);

    // Update local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = newMicState;
      });
    }

    // Notify other peers via socket
    toggleVoiceMic({ roomId, enabled: newMicState });
  }, [micOn, roomId]);

  /**
   * Leaves the voice room and cleans up connections.
   */
  const leaveVoiceRoom = useCallback(() => {
    // Close all peer connections
    peerConnections.forEach(call => call.close());

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Disconnect socket
    disconnectVoiceSocket();

    // Destroy peer
    if (peerRef.current) {
      peerRef.current.destroy();
    }

    // Reset state
    setConnected(false);
    setParticipants([]);
    setPeerConnections(new Map());
    setAudioStreams(new Map());
    setLocalStream(null);
    localStreamRef.current = null;
    peerRef.current = null;
  }, [peerConnections]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      // Initialize local stream
      await initializeLocalStream();

      // Initialize PeerJS
      initializePeer();

      // Connect socket
      connectVoiceSocket();

      // Set up socket event listeners
      const unsubscribers = [
        onVoiceSocketConnect(() => {
          console.log("Voice socket connected");
          setConnected(true);
          joinVoiceRoom(roomId, userInfo);
        }),
        onVoiceSocketDisconnect(() => {
          console.log("Voice socket disconnected");
          setConnected(false);
        }),
        onVoiceSocketError((error) => {
          console.error("Voice socket error:", error);
        }),
        onVoiceExistingUsers((users) => {
          console.log("Existing voice users:", users);
          setParticipants(users);
          // Call existing users
          users.forEach(user => {
            if (user.userInfo.peerId !== userInfo.peerId) {
              callPeer(user.userInfo.peerId);
            }
          });
        }),
        onVoiceUserJoined((data) => {
          console.log("Voice user joined:", data);
          setParticipants(prev => [...prev, data]);
          // Call the new user
          callPeer(data.userInfo.peerId);
        }),
        onVoiceUserLeft((data) => {
          console.log("Voice user left:", data);
          setParticipants(prev => prev.filter(p => p.socketId !== data.socketId));
          // Connection cleanup is handled in call.on("close")
        }),
        onVoiceOffer((data) => {
          // Handle incoming offers (PeerJS handles this automatically)
          console.log("Received voice offer from:", data.fromPeerId);
        }),
        onVoiceAnswer((data) => {
          // Handle incoming answers (PeerJS handles this automatically)
          console.log("Received voice answer from:", data.fromPeerId);
        }),
        onVoiceIceCandidate((data) => {
          // Handle ICE candidates (PeerJS handles this automatically)
          console.log("Received ICE candidate from:", data.fromPeerId);
        }),
        onVoiceMicUpdated((data) => {
          console.log("Mic updated:", data);
          // Could update UI to show mic status
        }),
        onVoiceRoomFull(() => {
          console.warn("Voice room is full");
          alert("La sala de voz está llena");
        }),
      ];

      return () => {
        unsubscribers.forEach(unsub => unsub());
      };
    };

    init();

    // Cleanup on unmount
    return () => {
      leaveVoiceRoom();
    };
  }, [roomId, userInfo, initializeLocalStream, initializePeer, callPeer, leaveVoiceRoom]);

  return {
    connected,
    participants,
    audioStreams,
    micOn,
    localStream,
    toggleMic,
    leaveVoiceRoom,
  };
}