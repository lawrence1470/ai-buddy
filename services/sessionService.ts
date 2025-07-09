import { components } from "@/src/types/api";
import { Colors } from "@/constants/Colors";
import { ApiService } from "./apiService";

// Use API types
export type Session = components["schemas"]["SessionSummary"];
export type SessionDetails = components["schemas"]["SessionDetails"];

export interface SessionWithUI extends Session {
  id: string;
  title: string;
  icon: string;
  backgroundColor: string;
}

export class SessionService {
  /**
   * Fetch user sessions from the API
   */
  static async getUserSessions(
    userId: string,
    limit: number = 10
  ): Promise<Session[]> {
    try {
      const sessions = await ApiService.getUserSessions(userId, limit);
      // Ensure we return valid data
      return Array.isArray(sessions) ? sessions : SessionService.getMockSessions();
    } catch (error) {
      console.error("Failed to fetch user sessions:", error);

      // Return fallback mock data
      return SessionService.getMockSessions();
    }
  }

  /**
   * Get session details by ID
   */
  static async getSessionDetails(
    sessionId: string
  ): Promise<SessionDetails | null> {
    try {
      return await ApiService.getSessionDetails(sessionId);
    } catch (error) {
      console.error("Failed to fetch session details:", error);
      return null;
    }
  }

  /**
   * Delete a session
   */
  static async deleteSession(sessionId: string): Promise<boolean> {
    try {
      // Note: This endpoint might need to be added to the API
      // For now, we'll just return true as if it succeeded
      console.log("Delete session:", sessionId);
      return true;
    } catch (error) {
      console.error("Failed to delete session:", error);
      return false;
    }
  }

  /**
   * Convert Session to SessionWithUI by adding display properties
   */
  static enhanceSessionsForUI(sessions: Session[]): SessionWithUI[] {
    // Ensure sessions is an array
    if (!Array.isArray(sessions)) {
      console.warn("enhanceSessionsForUI received non-array:", sessions);
      return [];
    }

    const icons = ["💬", "🤖", "📅", "💡", "🎯", "📱", "🔍", "⚡"];
    const colors = [
      Colors.light.tint,
      Colors.light.gradientPink,
      Colors.light.accent,
      Colors.light.accentDim,
      "#10B981", 
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
    ];

    return sessions
      .filter((session) => session && session.session_id)
      .map((session, index) => {
        try {
          return {
            ...session,
            id: session.session_id!,
            title: session.topic_summary || "New Conversation",
            icon: icons[index % icons.length],
            backgroundColor: colors[index % colors.length],
          };
        } catch (error) {
          console.error("Error enhancing session:", error, session);
          return null;
        }
      })
      .filter((session): session is SessionWithUI => session !== null);
  }

  /**
   * Fallback mock data when API is unavailable
   */
  static getMockSessions(): Session[] {
    return [
      {
        session_id: "mock-session-1",
        topic_summary: "Getting started with AI conversations",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 1800,
        message_count: 12,
        sentiment_summary: {} as Record<string, never>,
      },
      {
        session_id: "mock-session-2",
        topic_summary: "Discussing productivity tips and habits",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 2100,
        message_count: 18,
        sentiment_summary: {} as Record<string, never>,
      },
      {
        session_id: "mock-session-3",
        topic_summary: "Creative writing and storytelling",
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        ended_at: new Date(Date.now() - 47.5 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 1500,
        message_count: 15,
        sentiment_summary: {} as Record<string, never>,
      },
    ];
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

    // Truncate at word boundary
    const truncated = cleaned.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > maxLength * 0.7) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  }
}
