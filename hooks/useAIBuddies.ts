import { AIBuddyService } from "@/services/aiBuddyService";
import { useQuery } from "@tanstack/react-query";

export function useAIBuddies() {
  return useQuery({
    queryKey: ["ai-buddies"],
    queryFn: () => AIBuddyService.getAIBuddies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Retry twice on failure
  });
}

export function useAIBuddyDetails(buddyId: string | null) {
  return useQuery({
    queryKey: ["ai-buddy-details", buddyId],
    queryFn: () => (buddyId ? AIBuddyService.getAIBuddyDetails(buddyId) : null),
    enabled: !!buddyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
