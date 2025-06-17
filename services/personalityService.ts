import { supabase } from "../lib/supabase";

// Import the types from the API types file
export interface PersonalityProfile {
  confidence_score?: number;
  conversation_insights?: Record<string, any>;
  last_updated?: string;
  mbti_type?: string;
  sessions_analyzed?: number;
  trait_scores?: Record<string, number>;
  type_description?: string;
  user_id?: string;
}

export interface SessionRequest {
  session_id: string;
  session_metadata?: Record<string, any>;
  transcript: TranscriptMessage[];
  user_id: string;
}

export interface TranscriptMessage {
  content: string;
  emotions?: string[];
  sentiment_score?: number;
  speaker: "User" | "Assistant" | "System";
  timestamp: string;
}

export interface SessionProcessResult {
  personality_update?: Record<string, any>;
  processing_time_ms?: number;
  session_id?: string;
  session_insights?: Record<string, any>;
  success?: boolean;
  user_id?: string;
}

class PersonalityService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";
  }

  async getPersonalityProfile(
    userId: string
  ): Promise<PersonalityProfile | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${this.baseUrl}/personality/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // User not found or no personality data yet
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching personality profile:", error);
      throw error;
    }
  }

  async processSession(
    sessionRequest: SessionRequest
  ): Promise<SessionProcessResult> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${this.baseUrl}/sessions/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(sessionRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error processing session:", error);
      throw error;
    }
  }

  // Helper method to get MBTI type descriptions
  getMBTIDescription(mbtiType: string): string {
    const descriptions: Record<string, string> = {
      INTJ: "The Architect - Imaginative and strategic thinkers",
      INTP: "The Thinker - Innovative inventors with an unquenchable thirst for knowledge",
      ENTJ: "The Commander - Bold, imaginative and strong-willed leaders",
      ENTP: "The Debater - Smart and curious thinkers who cannot resist an intellectual challenge",
      INFJ: "The Advocate - Creative and insightful, inspired and independent",
      INFP: "The Mediator - Poetic, kind and altruistic people, always eager to help",
      ENFJ: "The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners",
      ENFP: "The Campaigner - Enthusiastic, creative and sociable free spirits",
      ISTJ: "The Logistician - Practical and fact-minded, reliable and responsible",
      ISFJ: "The Protector - Warm-hearted and dedicated, always ready to protect their loved ones",
      ESTJ: "The Executive - Excellent administrators, unsurpassed at managing things or people",
      ESFJ: "The Consul - Extraordinarily caring, social and popular people, always eager to help",
      ISTP: "The Virtuoso - Bold and practical experimenters, masters of all kinds of tools",
      ISFP: "The Adventurer - Flexible and charming artists, always ready to explore new possibilities",
      ESTP: "The Entrepreneur - Smart, energetic and very perceptive people, truly enjoy living on the edge",
      ESFP: "The Entertainer - Spontaneous, energetic and enthusiastic people - life is never boring",
    };

    return descriptions[mbtiType] || "Unknown personality type";
  }

  // Helper method to get trait labels
  getTraitLabel(traitKey: string): string {
    const labels: Record<string, string> = {
      extraversion: "Extraversion",
      introversion: "Introversion",
      sensing: "Sensing",
      intuition: "Intuition",
      thinking: "Thinking",
      feeling: "Feeling",
      judging: "Judging",
      perceiving: "Perceiving",
    };

    return labels[traitKey] || traitKey;
  }
}

export const personalityService = new PersonalityService();
