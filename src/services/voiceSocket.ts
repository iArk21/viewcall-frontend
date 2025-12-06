import { io, Socket } from "socket.io-client";

/**
 * Socket.IO client used for voice signaling.
 */
const VOICE_URL =
  import.meta.env.VITE_VOICE_SOCKET_URL || "http://localhost:4000";

export type VoiceUserInfo = {
  userId: string;
  displayName: string;
  peerId: string;
};

export type VoiceParticipant = {
  socketId: string;
  userInfo: VoiceUserInfo;
};

export type VoiceOfferPayload = {
  roomId: string;
  fromPeerId: string;
  offer: RTCSessionDescriptionInit;
};

export type VoiceAnswerPayload = {
  roomId: string;
  fromPeerId: string;
  answer: RTCSessionDescriptionInit;
};

export type VoiceIceCandidatePayload = {
  roomId: string;
  fromPeerId: string;
  candidate: RTCIceCandidateInit;
};

export type VoiceMicTogglePayload = {
  roomId: string;
  enabled: boolean;
};

// Single socket instance for the entire app.
const socket: Socket = io(VOICE_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

/**
 * Subscribes to a socket event and returns an unsubscribe function.
 *
 * @param {string} event Socket event name.
 * @param {(payload: TPayload) => void} handler Callback for the event payload.
 * @returns {() => void} Cleanup function to remove the listener.
 */
const subscribe = <TPayload>(
  event: string,
  handler: (payload: TPayload) => void
) => {
  socket.off(event, handler);
  socket.on(event, handler);
  return () => socket.off(event, handler);
};

/**
 * Opens the voice socket connection.
 */
export const connectVoiceSocket = () => socket.connect();

/**
 * Disconnects the voice socket connection.
 */
export const disconnectVoiceSocket = () => socket.disconnect();

/**
 * Joins a voice room with user metadata.
 *
 * @param {string} roomId Meeting/room identifier.
 * @param {VoiceUserInfo} userInfo Metadata for the joining user.
 */
export const joinVoiceRoom = (roomId: string, userInfo: VoiceUserInfo) =>
  socket.emit("join:voice-room", roomId, userInfo);

/**
 * Sends a WebRTC offer to another peer.
 *
 * @param {VoiceOfferPayload} payload Offer data.
 */
export const sendVoiceOffer = (payload: VoiceOfferPayload) =>
  socket.emit("voice:offer", payload);

/**
 * Sends a WebRTC answer to another peer.
 *
 * @param {VoiceAnswerPayload} payload Answer data.
 */
export const sendVoiceAnswer = (payload: VoiceAnswerPayload) =>
  socket.emit("voice:answer", payload);

/**
 * Sends an ICE candidate to another peer.
 *
 * @param {VoiceIceCandidatePayload} payload ICE candidate data.
 */
export const sendVoiceIceCandidate = (payload: VoiceIceCandidatePayload) =>
  socket.emit("voice:ice-candidate", payload);

/**
 * Toggles microphone state and notifies other peers.
 *
 * @param {VoiceMicTogglePayload} payload Mic toggle data.
 */
export const toggleVoiceMic = (payload: VoiceMicTogglePayload) =>
  socket.emit("voice:mic:toggle", payload);

/**
 * Subscribes to the initial participant list when joining a voice room.
 */
export const onVoiceExistingUsers = (handler: (users: VoiceParticipant[]) => void) =>
  subscribe("voice:existing:users", handler);

/**
 * Subscribes to a participant join event in voice room.
 */
export const onVoiceUserJoined = (
  handler: (data: VoiceParticipant) => void
) => subscribe("voice:user:joined", handler);

/**
 * Subscribes to a participant leave event in voice room.
 */
export const onVoiceUserLeft = (
  handler: (data: VoiceParticipant) => void
) => subscribe("voice:user:left", handler);

/**
 * Subscribes to incoming WebRTC offers.
 */
export const onVoiceOffer = (
  handler: (data: { fromPeerId: string; offer: RTCSessionDescriptionInit }) => void
) => subscribe("voice:offer", handler);

/**
 * Subscribes to incoming WebRTC answers.
 */
export const onVoiceAnswer = (
  handler: (data: { fromPeerId: string; answer: RTCSessionDescriptionInit }) => void
) => subscribe("voice:answer", handler);

/**
 * Subscribes to incoming ICE candidates.
 */
export const onVoiceIceCandidate = (
  handler: (data: { fromPeerId: string; candidate: RTCIceCandidateInit }) => void
) => subscribe("voice:ice-candidate", handler);

/**
 * Subscribes to microphone state updates from other peers.
 */
export const onVoiceMicUpdated = (
  handler: (data: { socketId: string; enabled: boolean }) => void
) => subscribe("voice:mic:updated", handler);

/**
 * Subscribes to the "voice room is full" event.
 */
export const onVoiceRoomFull = (handler: () => void) =>
  subscribe("voice:room:full", handler);

/**
 * Subscribes to voice socket connect.
 */
export const onVoiceSocketConnect = (handler: () => void) =>
  subscribe("connect", handler);

/**
 * Subscribes to voice socket disconnect.
 */
export const onVoiceSocketDisconnect = (handler: () => void) =>
  subscribe("disconnect", handler);

/**
 * Subscribes to voice socket connection errors.
 */
export const onVoiceSocketError = (handler: (err: Error) => void) =>
  subscribe("connect_error", handler);

export { socket as voiceSocket };