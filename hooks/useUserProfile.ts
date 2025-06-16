import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "../services/profileService";

// Query keys for caching
export const profileKeys = {
  all: ["profiles"] as const,
  user: (userId: string) => [...profileKeys.all, "user", userId] as const,
  userProfile: (userId: string) =>
    [...profileKeys.user(userId), "profile"] as const,
};

// Hook to get current user's profile
export function useUserProfile() {
  const { user } = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: userId ? profileKeys.userProfile(userId) : ["profile", "no-user"],
    queryFn: () => {
      if (!userId) throw new Error("User not authenticated");
      return ProfileService.getUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to check if user needs to complete profile
export function useProfileCompletion() {
  const { user } = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: userId
      ? [...profileKeys.userProfile(userId), "completion"]
      : ["profile", "completion", "no-user"],
    queryFn: async () => {
      if (!userId) return false;
      return ProfileService.hasCompletedProfile(userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation to create or update user profile
export function useUpsertUserProfile() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (profileData: { name: string }) => {
      if (!userId) throw new Error("User not authenticated");
      return ProfileService.upsertUserProfile(userId, profileData);
    },
    onSuccess: (data) => {
      if (!userId) return;

      // Update the cache with the new profile data
      queryClient.setQueryData(profileKeys.userProfile(userId), data);

      // Update profile completion status
      queryClient.setQueryData(
        [...profileKeys.userProfile(userId), "completion"],
        true
      );

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: profileKeys.user(userId) });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
}

// Mutation to update user profile name only
export function useUpdateUserProfileName() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (name: string) => {
      if (!userId) throw new Error("User not authenticated");
      return ProfileService.updateUserProfileName(userId, name);
    },
    onSuccess: (data) => {
      if (!userId) return;

      // Update the cache
      queryClient.setQueryData(profileKeys.userProfile(userId), data);
      queryClient.setQueryData(
        [...profileKeys.userProfile(userId), "completion"],
        true
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: profileKeys.user(userId) });
    },
  });
}

// Mutation to delete user profile
export function useDeleteUserProfile() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id;

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      return ProfileService.deleteUserProfile(userId);
    },
    onSuccess: () => {
      if (!userId) return;

      // Clear the cache
      queryClient.setQueryData(profileKeys.userProfile(userId), null);
      queryClient.setQueryData(
        [...profileKeys.userProfile(userId), "completion"],
        false
      );

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: profileKeys.user(userId) });
    },
  });
}

// Hook to get all profiles (for admin/search purposes)
export function useAllProfiles() {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: ProfileService.getAllProfiles,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to search profiles by name
export function useSearchProfiles(searchTerm: string) {
  return useQuery({
    queryKey: [...profileKeys.all, "search", searchTerm],
    queryFn: () => ProfileService.searchProfilesByName(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
