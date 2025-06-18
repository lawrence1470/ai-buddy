import { components } from "@/src/types/api";

type AIBuddy = components["schemas"]["AIBuddy"];
type AIBuddiesList = components["schemas"]["AIBuddiesList"];
type AIBuddyDetails = components["schemas"]["AIBuddyDetails"];

const API_BASE_URL = process.env.API_BASE_URL || "https://api.example.com"; // Update with your actual API URL

export class AIBuddyService {
  /**
   * Fetch all available AI buddies
   */
  static async getAIBuddies(): Promise<AIBuddy[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-buddies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch AI buddies: ${response.status}`);
      }

      const data: AIBuddiesList = await response.json();
      return data.ai_buddies || [];
    } catch (error) {
      console.error("Error fetching AI buddies:", error);
      // Return fallback data for development
      return this.getFallbackBuddies();
    }
  }

  /**
   * Get detailed information about a specific AI buddy
   */
  static async getAIBuddyDetails(buddyId: string): Promise<AIBuddy | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-buddies/${buddyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch AI buddy details: ${response.status}`);
      }

      const data: AIBuddyDetails = await response.json();
      return data.buddy || null;
    } catch (error) {
      console.error("Error fetching AI buddy details:", error);
      return null;
    }
  }

  /**
   * Fallback data for development/offline use
   */
  private static getFallbackBuddies(): AIBuddy[] {
    return [
      {
        id: "oliver",
        name: "Oliver",
        display_name: "🎩 Oliver - The British Gentleman",
        avatar: {
          emoji: "🎩",
          color_scheme: ["#2C3E50", "#34495E"],
        },
        personality: {
          description:
            "A charming British gentleman with a passion for literature",
          mbti_type: "ENFJ",
          conversation_style: "Thoughtful and eloquent",
          traits: ["empathetic", "articulate", "sophisticated", "wise"],
          specialties: ["literature", "philosophy", "history", "culture"],
        },
        voice: {
          gender: "male",
          accent: "british",
          tone: "sophisticated",
          pitch: "medium-low",
          speaking_rate: "measured",
          description: "Refined British accent with articulate pronunciation",
        },
        sample_responses: [
          "I say, that's rather fascinating",
          "How delightfully intriguing!",
          "Quite right, old chap",
        ],
      },
      {
        id: "luna",
        name: "Luna",
        display_name: "🌙 Luna - The Creative Dreamer",
        avatar: {
          emoji: "🌙",
          color_scheme: ["#8E44AD", "#9B59B6"],
        },
        personality: {
          description: "A creative and intuitive dreamer with artistic flair",
          mbti_type: "INFP",
          conversation_style: "Imaginative and inspiring",
          traits: ["creative", "empathetic", "intuitive", "artistic"],
          specialties: ["art", "creativity", "psychology", "spirituality"],
        },
        voice: {
          gender: "female",
          accent: "american",
          tone: "warm",
          pitch: "medium",
          speaking_rate: "flowing",
          description: "Gentle, warm voice with creative expression",
        },
        sample_responses: [
          "Oh, what a beautiful way to think about it!",
          "I can imagine the colors swirling in my mind",
          "That sparks such wonderful creativity!",
        ],
      },
      {
        id: "zara",
        name: "Zara",
        display_name: "⚡ Zara - The Tech Innovator",
        avatar: {
          emoji: "⚡",
          color_scheme: ["#E74C3C", "#C0392B"],
        },
        personality: {
          description: "A brilliant tech innovator with endless energy",
          mbti_type: "ENTP",
          conversation_style: "Dynamic and forward-thinking",
          traits: ["innovative", "energetic", "analytical", "ambitious"],
          specialties: [
            "technology",
            "innovation",
            "problem-solving",
            "future",
          ],
        },
        voice: {
          gender: "female",
          accent: "american",
          tone: "energetic",
          pitch: "medium-high",
          speaking_rate: "quick",
          description: "Energetic, confident voice with tech enthusiasm",
        },
        sample_responses: [
          "That's exactly the kind of disruption we need!",
          "Let's think outside the box on this one",
          "The possibilities are absolutely endless!",
        ],
      },
    ];
  }
}

export type { AIBuddiesList, AIBuddy, AIBuddyDetails };
