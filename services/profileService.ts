import {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  supabase,
} from "../lib/supabase";

export class ProfileService {
  // Get profile by Clerk user ID
  static async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Profile not found
      }
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }

    return data;
  }

  // Create or update user profile (upsert)
  static async upsertUserProfile(
    userId: string,
    profileData: { name: string }
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profile")
      .upsert(
        {
          user_id: userId,
          name: profileData.name,
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save user profile: ${error.message}`);
    }

    return data;
  }

  // Create user profile
  static async createUserProfile(
    userId: string,
    name: string
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profile")
      .insert({
        user_id: userId,
        name: name,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }

    return data;
  }

  // Update user profile name
  static async updateUserProfileName(
    userId: string,
    name: string
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profile")
      .update({ name })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile name: ${error.message}`);
    }

    return data;
  }

  // Check if user has completed profile (has a name)
  static async hasCompletedProfile(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId);
    return (
      profile !== null &&
      profile.name !== null &&
      profile.name.trim().length > 0
    );
  }

  // Delete user profile
  static async deleteUserProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from("profile")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete user profile: ${error.message}`);
    }
  }

  // Legacy methods for backward compatibility
  static async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase.from("profile").select("*");

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data || [];
  }

  static async getProfileById(id: number): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  static async createProfile(profile: ProfileInsert): Promise<Profile> {
    const { data, error } = await supabase
      .from("profile")
      .insert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  }

  static async updateProfile(
    id: number,
    updates: ProfileUpdate
  ): Promise<Profile> {
    const { data, error } = await supabase
      .from("profile")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  static async deleteProfile(id: number): Promise<void> {
    const { error } = await supabase.from("profile").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  static async searchProfilesByName(searchTerm: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .ilike("name", `%${searchTerm}%`);

    if (error) {
      throw new Error(`Failed to search profiles: ${error.message}`);
    }

    return data || [];
  }
}
