import {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  supabase,
} from "../lib/supabase";

export class ProfileService {
  // Get all profiles
  static async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase.from("profile").select("*");

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data || [];
  }

  // Get profile by ID
  static async getProfileById(id: number): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Profile not found
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  // Create a new profile
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

  // Update an existing profile
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

  // Delete a profile
  static async deleteProfile(id: number): Promise<void> {
    const { error } = await supabase.from("profile").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }

  // Get profiles by name (partial match)
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
