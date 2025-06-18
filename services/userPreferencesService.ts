import AsyncStorage from "@react-native-async-storage/async-storage";
import { AIBuddy } from "./aiBuddyService";

const SELECTED_BUDDY_KEY = "selectedAIBuddy";
const USER_PREFERENCES_KEY = "userPreferences";

export interface UserPreferences {
  selectedBuddyId?: string;
  selectedBuddy?: AIBuddy;
}

export class UserPreferencesService {
  /**
   * Save the user's selected AI buddy
   */
  static async setSelectedBuddy(buddy: AIBuddy): Promise<void> {
    try {
      await AsyncStorage.setItem(SELECTED_BUDDY_KEY, JSON.stringify(buddy));

      // Also save just the buddy ID for quick access
      const preferences: UserPreferences = {
        selectedBuddyId: buddy.id,
        selectedBuddy: buddy,
      };
      await AsyncStorage.setItem(
        USER_PREFERENCES_KEY,
        JSON.stringify(preferences)
      );

      console.log("Selected buddy saved:", buddy.name);
    } catch (error) {
      console.error("Error saving selected buddy:", error);
      throw error;
    }
  }

  /**
   * Get the user's selected AI buddy
   */
  static async getSelectedBuddy(): Promise<AIBuddy | null> {
    try {
      const buddyJson = await AsyncStorage.getItem(SELECTED_BUDDY_KEY);
      if (buddyJson) {
        return JSON.parse(buddyJson) as AIBuddy;
      }
      return null;
    } catch (error) {
      console.error("Error getting selected buddy:", error);
      return null;
    }
  }

  /**
   * Get the user preferences
   */
  static async getUserPreferences(): Promise<UserPreferences> {
    try {
      const preferencesJson = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
      if (preferencesJson) {
        return JSON.parse(preferencesJson) as UserPreferences;
      }
      return {};
    } catch (error) {
      console.error("Error getting user preferences:", error);
      return {};
    }
  }

  /**
   * Clear the selected buddy
   */
  static async clearSelectedBuddy(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SELECTED_BUDDY_KEY);

      // Also clear from user preferences
      const preferences = await this.getUserPreferences();
      delete preferences.selectedBuddyId;
      delete preferences.selectedBuddy;
      await AsyncStorage.setItem(
        USER_PREFERENCES_KEY,
        JSON.stringify(preferences)
      );

      console.log("Selected buddy cleared");
    } catch (error) {
      console.error("Error clearing selected buddy:", error);
      throw error;
    }
  }

  /**
   * Check if user has a selected buddy
   */
  static async hasSelectedBuddy(): Promise<boolean> {
    try {
      const buddy = await this.getSelectedBuddy();
      return buddy !== null;
    } catch (error) {
      console.error("Error checking selected buddy:", error);
      return false;
    }
  }
}
