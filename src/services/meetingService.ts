/**
 * Meeting Service - Handle meeting-related requests.
 * Uses Fetch API and environment variables.
 *
 * @module meetingService
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Create a new meeting.
 * @param hostId - The ID of the meeting creator
 * @returns Created meeting data
 */
export async function createMeeting(hostId: string) {
  const response = await fetch(`${API_URL}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hostId }),
  });

  if (!response.ok) throw new Error("Error creating meeting");

  return await response.json();
}

/**
 * Join an existing meeting by ID.
 * @param meetingId - The meeting ID
 * @param userId - The user trying to join
 */
export async function joinMeeting(meetingId: string) {
    const response = await fetch(`${API_URL}/meetings/${meetingId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // ya no enviamos nada
    });
  
    if (!response.ok) throw new Error("Error joining meeting");
  
    return await response.json();
  }
  

/**
 * Get meeting info.
 * @param meetingId - Meeting identifier
 */
export async function getMeeting(meetingId: string) {
  const response = await fetch(`${API_URL}/meetings/${meetingId}`);
  if (!response.ok) throw new Error("Meeting not found");

  return await response.json();
}
