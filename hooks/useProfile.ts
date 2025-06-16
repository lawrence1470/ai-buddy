import { useEffect, useState } from "react";
import { Profile, ProfileInsert, ProfileUpdate } from "../lib/supabase";
import { ProfileService } from "../services/profileService";

export function useProfile(id?: number) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchProfile = async (profileId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfileService.getProfileById(profileId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (
    profileData: ProfileInsert
  ): Promise<Profile | null> => {
    try {
      setLoading(true);
      setError(null);
      const newProfile = await ProfileService.createProfile(profileData);
      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    profileId: number,
    updates: ProfileUpdate
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await ProfileService.updateProfile(
        profileId,
        updates
      );
      setProfile(updatedProfile);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (profileId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await ProfileService.deleteProfile(profileId);
      setProfile(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    refetch: id ? () => fetchProfile(id) : undefined,
  };
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfileService.getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const searchProfiles = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfileService.searchProfilesByName(searchTerm);
      setProfiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    profiles,
    loading,
    error,
    refetch: fetchProfiles,
    searchProfiles,
  };
}
