import { AIBuddyService } from "@/services/aiBuddyService";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

export function useSelectedBuddy() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["selected-buddy", user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      return AIBuddyService.getUserSelectedBuddy(user.id);
    },
    enabled: !!user?.id, // Only run query when user is authenticated
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
