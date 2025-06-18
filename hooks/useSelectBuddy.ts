import { AIBuddyService } from "@/services/aiBuddyService";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSelectBuddy() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (buddyId: string) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      console.log("=== Buddy Selection Debug ===");
      console.log("User ID:", user.id);
      console.log("Selected Buddy ID:", buddyId);
      console.log("============================");

      const success = await AIBuddyService.setUserSelectedBuddy(
        user.id,
        buddyId
      );
      if (!success) {
        throw new Error("Backend selection failed");
      }
      return { buddyId, success };
    },
    onMutate: async (buddyId: string) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["selected-buddy", user?.id],
      });

      // Snapshot the previous value
      const previousSelectedBuddy = queryClient.getQueryData([
        "selected-buddy",
        user?.id,
      ]);

      // Get the buddy details from the buddies list cache
      const buddies = queryClient.getQueryData(["ai-buddies"]) as any[];
      const selectedBuddy = buddies?.find((buddy) => buddy.id === buddyId);

      // Optimistically update the cache
      if (selectedBuddy) {
        queryClient.setQueryData(["selected-buddy", user?.id], selectedBuddy);
        console.log(
          "Optimistically updated selected buddy to:",
          selectedBuddy.name
        );
      }

      // Return context object with the snapshotted value
      return { previousSelectedBuddy };
    },
    onError: (err, buddyId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSelectedBuddy) {
        queryClient.setQueryData(
          ["selected-buddy", user?.id],
          context.previousSelectedBuddy
        );
      }
      console.error("Error in buddy selection mutation, rolled back:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: ["selected-buddy", user?.id],
      });

      console.log("Selected buddy cache invalidated for consistency");
    },
  });
}
