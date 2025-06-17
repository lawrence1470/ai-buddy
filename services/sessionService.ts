import {
  API_ENDPOINTS,
  buildApiUrl,
  createFetchOptions,
} from "@/constants/api";

export interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  duration_minutes?: number;
  last_message?: string;
}

export interface SessionWithUI extends Session {
  icon: string;
  backgroundColor: string;
}

export class SessionService {
  /**
   * Fetch recent sessions for a user
   */
  static async getUserSessions(userId: string): Promise<Session[]> {
    try {
      console.log(`Fetching sessions for user: ${userId}`);

      const url = buildApiUrl(API_ENDPOINTS.USER_SESSIONS(userId));
      const response = await fetch(
        url,
        createFetchOptions({
          method: "GET",
        })
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No sessions found for user");
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sessions: Session[] = await response.json();
      console.log(`Retrieved ${sessions.length} sessions`);

      return sessions;
    } catch (error) {
      console.error("Failed to fetch user sessions:", error);
      throw error;
    }
  }

  /**
   * Convert Session to SessionWithUI by adding display properties
   */
  static enhanceSessionsForUI(sessions: Session[]): SessionWithUI[] {
    const icons = ["💬", "🤖", "📅", "💡", "🎯", "📱", "🔍", "⚡"];
    const colors = [
      "#667EEA",
      "#764ABC",
      "#06B6D4",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
    ];

    return sessions.map((session, index) => ({
      ...session,
      icon: icons[index % icons.length],
      backgroundColor: colors[index % colors.length],
    }));
  }

  /**
   * Delete a session (if backend supports it)
   */
  static async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const url = buildApiUrl(API_ENDPOINTS.DELETE_SESSION(sessionId));
      const response = await fetch(
        url,
        createFetchOptions({
          method: "DELETE",
        })
      );

      return response.ok;
    } catch (error) {
      console.error("Failed to delete session:", error);
      return false;
    }
  }

  /**
   * Format session title from last message or generate from content
   */
  static generateSessionTitle(
    firstMessage: string,
    maxLength: number = 40
  ): string {
    if (!firstMessage || firstMessage.trim().length === 0) {
      return "New Conversation";
    }

    // Clean up the message
    const cleaned = firstMessage.trim();

    // If it's short enough, use as is
    if (cleaned.length <= maxLength) {
      return cleaned;
    }

    // Truncate at word boundary
    const truncated = cleaned.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > maxLength * 0.7) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  }
}
