import { API_CONFIG } from "@/constants/api";
import { components } from "@/src/types/api";

type AIBuddy = components["schemas"]["AIBuddy"];
type AIBuddiesList = components["schemas"]["AIBuddiesList"];
type AIBuddyDetails = components["schemas"]["AIBuddyDetails"];
type SelectedBuddyResponse = components["schemas"]["SelectedBuddyResponse"];
type SelectBuddyRequest = components["schemas"]["SelectBuddyRequest"];
type SelectBuddyResponse = components["schemas"]["SelectBuddyResponse"];

export class AIBuddyService {
  /**
   * Fetch all available AI buddies
   */
  static async getAIBuddies(): Promise<AIBuddy[]> {
    try {
      console.log("Fetching AI buddies from backend:", API_CONFIG.BASE_URL);

      if (!API_CONFIG.BASE_URL) {
        throw new Error("API_CONFIG.BASE_URL not configured");
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/ai-buddies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch AI buddies: ${response.status}`);
      }

      const data: AIBuddiesList = await response.json();

      // Debug: Log what the backend returned
      console.log("=== Backend Response Debug ===");
      console.log("Backend returned:", JSON.stringify(data, null, 2));
      console.log("Number of buddies:", data.ai_buddies?.length || 0);
      if (data.ai_buddies && data.ai_buddies.length > 0) {
        console.log("First buddy voice data:", data.ai_buddies[0].voice);
        console.log("First buddy avatar data:", data.ai_buddies[0].avatar);
        console.log(
          "First buddy color scheme:",
          data.ai_buddies[0].avatar?.color_scheme
        );

        // Log all buddies' color schemes
        data.ai_buddies.forEach((buddy, index) => {
          console.log(`Buddy ${index + 1} (${buddy.name}):`, {
            name: buddy.name,
            avatar: buddy.avatar,
            color_scheme: buddy.avatar?.color_scheme,
          });
        });
      }
      console.log("==============================");

      return data.ai_buddies || [];
    } catch (error) {
      console.error("Error fetching AI buddies from backend:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific AI buddy
   */
  static async getAIBuddyDetails(buddyId: string): Promise<AIBuddy | null> {
    try {
      if (!API_CONFIG.BASE_URL) {
        throw new Error("API_CONFIG.BASE_URL not configured");
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/ai-buddies/${buddyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch AI buddy details: ${response.status}`);
      }

      const data: AIBuddyDetails = await response.json();
      return data.buddy || null;
    } catch (error) {
      console.error("Error fetching AI buddy details from backend:", error);
      throw error;
    }
  }

  /**
   * Get the user's selected AI buddy from the backend
   */
  static async getUserSelectedBuddy(userId: string): Promise<AIBuddy | null> {
    try {
      if (!API_CONFIG.BASE_URL) {
        throw new Error("API_CONFIG.BASE_URL not configured");
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/users/${userId}/selected-buddy`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 502) {
          console.warn("Backend server error (502). The server may be down or restarting.");
          return null;
        }
        throw new Error(`Failed to fetch selected buddy: ${response.status}`);
      }

      const data: SelectedBuddyResponse = await response.json();

      console.log("=== Selected Buddy Response Debug ===");
      console.log("Selected buddy response:", JSON.stringify(data, null, 2));
      console.log("====================================");

      // If we have buddy details, return them
      if (data.buddy_details) {
        // Convert the buddy details to a full AIBuddy object
        const fullBuddy = await this.getAIBuddyDetails(
          data.selected_buddy || "oliver"
        );

        console.log("=== Full Selected Buddy Debug ===");
        console.log("Full buddy data:", JSON.stringify(fullBuddy, null, 2));
        console.log("Buddy avatar:", fullBuddy?.avatar);
        console.log("Buddy color scheme:", fullBuddy?.avatar?.color_scheme);
        console.log("=================================");

        return fullBuddy;
      }

      // Get the buddy by ID
      if (data.selected_buddy) {
        const buddy = await this.getAIBuddyDetails(data.selected_buddy);

        console.log("=== Selected Buddy by ID Debug ===");
        console.log("Buddy data:", JSON.stringify(buddy, null, 2));
        console.log("Buddy avatar:", buddy?.avatar);
        console.log("Buddy color scheme:", buddy?.avatar?.color_scheme);
        console.log("=================================");

        return buddy;
      }

      return null;
    } catch (error) {
      console.error(
        "Error fetching user's selected buddy from backend:",
        error
      );
      if (error instanceof Error && error.message.includes("502")) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Set the user's selected AI buddy
   */
  static async setUserSelectedBuddy(
    userId: string,
    buddyId: string
  ): Promise<boolean> {
    try {
      if (!API_CONFIG.BASE_URL) {
        throw new Error("API_CONFIG.BASE_URL not configured");
      }

      const requestBody: SelectBuddyRequest = {
        buddy_id: buddyId as any, // The API expects specific buddy IDs
      };

      // Debug: Log the request details
      console.log("=== AIBuddyService.setUserSelectedBuddy Debug ===");
      console.log(
        "API URL:",
        `${API_CONFIG.BASE_URL}/users/${userId}/select-buddy`
      );
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));
      console.log("User ID:", userId);
      console.log("Buddy ID:", buddyId);
      console.log("===============================================");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/users/${userId}/select-buddy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Debug: Log response details
      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);

      if (!response.ok) {
        // Try to get the response body for more details
        let errorDetails = "";
        try {
          const errorBody = await response.text();
          errorDetails = errorBody;
          console.log("Error Response Body:", errorBody);
        } catch (e) {
          console.log("Could not read error response body");
        }

        throw new Error(
          `Failed to set selected buddy: ${response.status}${
            errorDetails ? ` - ${errorDetails}` : ""
          }`
        );
      }

      const data: SelectBuddyResponse = await response.json();
      console.log("Success Response:", JSON.stringify(data, null, 2));
      return data.success || false;
    } catch (error) {
      console.error("Error setting user's selected buddy:", error);
      throw error;
    }
  }
}

export type {
  AIBuddiesList,
  AIBuddy,
  AIBuddyDetails,
  SelectBuddyRequest,
  SelectBuddyResponse,
  SelectedBuddyResponse,
};
