import { ApiService } from "@/services/apiService";
import { ChatMessage } from "@/services/chatService";
import { components } from "@/src/types/api";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// API Types
type ChatRequest = components["schemas"]["ChatRequest"];
type ChatResponse = components["schemas"]["ChatResponse"];

// Chat query keys for caching
export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  conversation: (id: string) => [...chatKeys.conversations(), id] as const,
};

// Hook for sending chat messages
export function useSendChatMessage() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      conversationContext,
      isVoice = false,
      buddyId,
    }: {
      message: string;
      conversationContext: ChatMessage[];
      isVoice?: boolean;
      buddyId?: string;
    }): Promise<ChatResponse> => {
      if (!message.trim()) {
        throw new Error("Message cannot be empty");
      }

      // Prepare conversation context for API
      const contextForAPI = conversationContext.map((msg) => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: msg.timestamp.toISOString(),
      }));

      const chatRequest: ChatRequest = {
        text: message,
        is_voice: isVoice,
        user_id: user?.id,
        conversation_context: contextForAPI,
        buddy_id: buddyId as "oliver" | "luna" | "zara" | undefined, // Type-safe buddy_id
      };

      return ApiService.sendChatMessage(chatRequest);
    },
    onSuccess: (data, variables) => {
      // Optionally update cache or trigger other side effects
      console.log("Chat message sent successfully:", data);
    },
    onError: (error, variables) => {
      console.error("Failed to send chat message:", error);
    },
    // Retry configuration
    retry: (failureCount, error: any) => {
      // Don't retry on client errors (4xx)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Type-safe error handling for chat mutations
export interface ChatError {
  message: string;
  status?: number;
  code?: string;
}

export function isChatError(error: unknown): error is ChatError {
  return typeof error === "object" && error !== null && "message" in error;
}

// Hook for managing chat state with optimistic updates
export function useChatMutation() {
  const sendChatMessage = useSendChatMessage();

  const sendMessage = async (
    message: string,
    conversationContext: ChatMessage[],
    isVoice: boolean = false,
    buddyId?: string
  ): Promise<string> => {
    try {
      const result = await sendChatMessage.mutateAsync({
        message,
        conversationContext,
        isVoice,
        buddyId,
      });

      if (!result.success || !result.response) {
        throw new Error(result.error || "No response from AI");
      }

      return result.response;
    } catch (error) {
      if (isChatError(error)) {
        throw new Error(error.message);
      }
      throw new Error("Failed to send message. Please try again.");
    }
  };

  return {
    sendMessage,
    isLoading: sendChatMessage.isPending,
    error: sendChatMessage.error,
    reset: sendChatMessage.reset,
    // Expose the mutation directly for advanced usage
    mutation: sendChatMessage,
  };
}
