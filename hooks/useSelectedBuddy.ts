import { AIBuddyService } from "@/services/aiBuddyService";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

export function useSelectedBuddy() {
  const { user } = useUser();

  const query = useQuery({
    queryKey: ["selected-buddy", user?.id],
    queryFn: async () => {
      console.log("🔍 useSelectedBuddy: Starting query for user:", user?.id);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      const result = await AIBuddyService.getUserSelectedBuddy(user.id);
      console.log("🔍 useSelectedBuddy: Query result:", result);
      console.log("🔍 useSelectedBuddy: Avatar data:", result?.avatar);
      console.log(
        "🔍 useSelectedBuddy: Color scheme:",
        result?.avatar?.color_scheme
      );
      return result;
    },
    enabled: !!user?.id, // Only run query when user is authenticated
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  console.log("🔍 useSelectedBuddy hook state:", {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
    userId: user?.id,
  });

  return query;
}
