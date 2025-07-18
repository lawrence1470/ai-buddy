import { Colors } from "@/constants/Colors";
import { useChatMutation } from "@/hooks/useChat";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelectedBuddy } from "@/hooks/useSelectedBuddy";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { ChatMessage } from "@/services/chatService";
import { TTSService } from "@/services/ttsService";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Loading from "./Loading";
import { ThemedText } from "./ThemedText";
import VoiceRecorder from "./VoiceRecorder";

// Re-export ChatMessage for convenience
export type { ChatMessage } from "@/services/chatService";

interface ChatProps {
  messages?: ChatMessage[];
  isLoading?: boolean;
  onMessageSent?: (message: ChatMessage) => void;
  onAIResponse?: (message: ChatMessage) => void;
  isKeyboardVisible?: boolean;
}

export interface ChatRef {
  sendTextMessage: (text: string) => Promise<void>;
}

const Chat = forwardRef<ChatRef, ChatProps>(
  (
    {
      messages = [],
      isLoading = false,
      onMessageSent,
      onAIResponse,
      isKeyboardVisible = false,
    },
    ref
  ) => {
    const flatListRef = useRef<FlatList>(null);
    const colorScheme = useColorScheme();
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);
    const [isAIResponding, setIsAIResponding] = useState(false);

    // Get selected AI buddy
    const {
      data: selectedBuddy,
      isLoading: buddyLoading,
      error: buddyError,
    } = useSelectedBuddy();

    // Use the new chat mutation hook
    const {
      sendMessage,
      isLoading: isChatLoading,
      error: chatError,
      reset: resetChatError,
    } = useChatMutation();

    const {
      isRecording,
      isVoiceLoading,
      recordingDuration,
      startRecording,
      stopRecording,
    } = useVoiceRecording();

    const isDark = colorScheme === "dark";

    // Update messages when props change
    useEffect(() => {
      setChatMessages(messages);
    }, [messages]);

    // Log buddy selection
    useEffect(() => {
      if (selectedBuddy) {
        console.log(
          "Selected AI buddy:",
          selectedBuddy.name,
          selectedBuddy.voice
        );
      }
    }, [selectedBuddy]);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
      if (chatMessages.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, [chatMessages.length]);

    // Reset chat error when component mounts or when starting a new message
    useEffect(() => {
      if (chatError) {
        console.error("Chat error:", chatError);
      }
    }, [chatError]);

    // Handle text messages (from text input)
    const handleTextMessage = useCallback(
      async (text: string) => {
        if (!text.trim()) return;

        // Reset any previous errors
        resetChatError();

        try {
          // Create user message
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: text,
            isUser: true,
            timestamp: new Date(),
            isVoice: false,
          };

          // Add user message to chat
          setChatMessages((prev) => [...prev, userMessage]);
          onMessageSent?.(userMessage);

          // Set AI responding state
          setIsAIResponding(true);

          // Get AI response using TanStack Query mutation with buddy_id
          const aiResponse = await sendMessage(
            text,
            chatMessages,
            false,
            selectedBuddy?.id
          );

          // Create AI message
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: aiResponse,
            isUser: false,
            timestamp: new Date(),
          };

          // Add AI message to chat
          setChatMessages((prev) => [...prev, aiMessage]);
          onAIResponse?.(aiMessage);

          setIsAIResponding(false);
        } catch (error) {
          console.error("Error handling text message:", error);
          setIsAIResponding(false);

          // Show error message to user
          const errorMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            text:
              error instanceof Error
                ? error.message
                : "I'm having trouble responding right now. Please try again.",
            isUser: false,
            timestamp: new Date(),
          };

          setChatMessages((prev) => [...prev, errorMessage]);
          onAIResponse?.(errorMessage);
        }
      },
      [
        sendMessage,
        chatMessages,
        onMessageSent,
        onAIResponse,
        resetChatError,
        selectedBuddy?.id,
      ]
    );

    // Expose handleTextMessage via ref
    useImperativeHandle(
      ref,
      () => ({
        sendTextMessage: handleTextMessage,
      }),
      [handleTextMessage]
    );

    const handleVoiceMessage = useCallback(
      async (transcribedText: string) => {
        if (!transcribedText.trim()) return;

        // Reset any previous errors
        resetChatError();

        try {
          // Create user message
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: transcribedText,
            isUser: true,
            timestamp: new Date(),
            isVoice: true,
          };

          // Add user message to chat
          setChatMessages((prev) => [...prev, userMessage]);
          onMessageSent?.(userMessage);

          // Set AI responding state
          setIsAIResponding(true);

          // Get AI response using TanStack Query mutation with buddy_id
          const aiResponse = await sendMessage(
            transcribedText,
            chatMessages,
            true,
            selectedBuddy?.id
          );

          // Create AI message
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: aiResponse,
            isUser: false,
            timestamp: new Date(),
          };

          // Add AI message to chat
          setChatMessages((prev) => [...prev, aiMessage]);
          onAIResponse?.(aiMessage);

          // Speak AI response with buddy's voice characteristics
          try {
            await TTSService.speakText(aiResponse, selectedBuddy || undefined);
          } catch (ttsError) {
            console.log("TTS failed, but continuing:", ttsError);
            // Don't stop the conversation if TTS fails
          }

          setIsAIResponding(false);
        } catch (error) {
          console.error("Error handling voice message:", error);
          setIsAIResponding(false);

          // Show error message to user
          const errorMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            text:
              error instanceof Error
                ? error.message
                : "I'm having trouble responding right now. Please try again.",
            isUser: false,
            timestamp: new Date(),
          };

          setChatMessages((prev) => [...prev, errorMessage]);
          onAIResponse?.(errorMessage);
        }
      },
      [
        sendMessage,
        chatMessages,
        onMessageSent,
        onAIResponse,
        resetChatError,
        selectedBuddy,
      ]
    );

    const handleStopRecording = useCallback(async () => {
      const transcribedText = await stopRecording();
      if (transcribedText) {
        await handleVoiceMessage(transcribedText);
      }
    }, [stopRecording, handleVoiceMessage]);

    const renderMessage = ({ item }: { item: ChatMessage }) => {
      const isUser = item.isUser;
      const messageTime = item.timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <View
          style={[
            styles.messageContainer,
            isUser ? styles.userMessageContainer : styles.aiMessageContainer,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isUser
                ? [
                    styles.userBubble,
                    { backgroundColor: isDark ? Colors.dark.gradientStart : Colors.light.gradientStart },
                  ]
                : [
                    styles.aiBubble,
                    {
                      backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
                      borderWidth: 1,
                      borderColor: isDark ? Colors.dark.border : Colors.light.border,
                    },
                  ],
            ]}
          >
            <ThemedText
              style={[
                styles.messageText,
                isUser
                  ? styles.userMessageText
                  : {
                      color: isDark ? Colors.dark.text : Colors.light.text,
                    },
              ]}
            >
              {item.text}
            </ThemedText>

            {item.isVoice && (
              <View style={styles.voiceIndicator}>
                <ThemedText style={styles.voiceIcon}>🎤</ThemedText>
              </View>
            )}
          </View>

          <ThemedText
            style={[
              styles.timestamp,
              { color: isDark ? Colors.dark.textTertiary : Colors.light.textTertiary },
            ]}
          >
            {messageTime}
          </ThemedText>
        </View>
      );
    };

    const renderEmptyState = () => (
      <View style={styles.emptyStateContainer}>
        <ThemedText
          style={[
            styles.emptyStateText,
            { color: isDark ? "#8E8E93" : "#8E8E93" },
          ]}
        >
          {selectedBuddy
            ? `Hi! I&apos;m ${selectedBuddy.name}. ${
                selectedBuddy.personality?.description ||
                "Tap the microphone to start our conversation!"
              }`
            : "Hi! I&apos;m your AI buddy. Tap the microphone to start a voice conversation!"}
        </ThemedText>
        {buddyError && (
          <ThemedText
            style={[
              styles.errorText,
              { color: Colors.light.accent, marginTop: 8 },
            ]}
          >
            Note: Using default voice (couldn&apos;t load your selected buddy)
          </ThemedText>
        )}
      </View>
    );

    const renderLoadingIndicator = () => {
      if (!isLoading && !isAIResponding && !isChatLoading) return null;

      return (
        <View style={[styles.messageContainer, styles.aiMessageContainer]}>
          <Loading 
            size={30} 
            fullScreen={false} 
            message={isAIResponding ? "AI is thinking..." : "Loading..."}
          />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderLoadingIndicator}
        />

        {/* Voice Recording Interface */}
        <VoiceRecorder
          isRecording={isRecording}
          isVoiceLoading={isVoiceLoading}
          recordingDuration={recordingDuration}
          onStartRecording={startRecording}
          onStopRecording={handleStopRecording}
          isKeyboardVisible={isKeyboardVisible}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 16,
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  messageContainer: {
    marginVertical: 6,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  aiMessageContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 0,
  },
  aiBubble: {
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  voiceIndicator: {
    marginTop: 4,
    alignSelf: "flex-end",
  },
  voiceIcon: {
    fontSize: 12,
    opacity: 0.7,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 8,
  },
});

Chat.displayName = "Chat";

export default Chat;
