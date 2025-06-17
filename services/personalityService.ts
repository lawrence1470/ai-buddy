import { components } from "@/src/types/api";
import { ApiService } from "./apiService";

// Use the API types directly instead of custom interfaces
export type PersonalityProfile = components["schemas"]["PersonalityProfile"];
export type SessionRequest = components["schemas"]["SessionRequest"];
export type TranscriptMessage = components["schemas"]["TranscriptMessage"];
export type SessionProcessResult =
  components["schemas"]["SessionProcessResult"];

class PersonalityService {
  async getPersonalityProfile(
    userId: string
  ): Promise<PersonalityProfile | null> {
    try {
      return await ApiService.getPersonalityProfile(userId);
    } catch (error) {
      console.error("Error fetching personality profile:", error);

      // If it's a "not found" error, return null
      if (error instanceof Error && error.message.includes("not found")) {
        return null;
      }

      throw error;
    }
  }

  async processSession(
    sessionRequest: SessionRequest
  ): Promise<SessionProcessResult> {
    try {
      return await ApiService.processSession(sessionRequest);
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
