import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useCallback, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatInput from "./ChatInput";
import { ThemedText } from "./ThemedText";
import VoiceListener from "./VoiceListener";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isVoice?: boolean;
}

interface ChatProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  onVoiceMessage?: (uri: string) => void;
  onTranscriptionReceived?: (text: string) => void;
  isLoading?: boolean;
  showVoiceInterface?: boolean;
}

export default function Chat({
  messages = [],
  onSendMessage,
  onVoiceMessage,
  onTranscriptionReceived,
  isLoading = false,
  showVoiceInterface = true,
}: ChatProps) {
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const handleVoicePress = useCallback(() => {
    // This will be handled by the VoiceListener component
    console.log("Voice button pressed");
  }, []);

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
                  { backgroundColor: isDark ? "#667EEA" : "#667EEA" },
                ]
              : [
                  styles.aiBubble,
                  {
                    backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
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
                    color: isDark ? "#FFFFFF" : "#1C1C1E",
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
          style={[styles.timestamp, { color: isDark ? "#8E8E93" : "#8E8E93" }]}
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
        Hi! I&apos;m ready to help you. Start by recording your voice message or
        type below.
      </ThemedText>
    </View>
  );

  const renderLoadingIndicator = () => {
    if (!isLoading) return null;

    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <View
          style={[
            styles.messageBubble,
            styles.aiBubble,
            {
              backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
            },
          ]}
        >
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, styles.typingDot1]} />
            <View style={[styles.typingDot, styles.typingDot2]} />
            <View style={[styles.typingDot, styles.typingDot3]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderLoadingIndicator}
      />

      {/* Input Section */}
      <View
        style={[
          styles.inputSection,
          {
            backgroundColor: isDark ? "#1C1C1E" : "#F8F6F0",
            borderTopColor: isDark ? "#2C2C2E" : "rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        {/* Voice Interface */}
        {showVoiceInterface && (
          <View style={styles.voiceContainer}>
            <VoiceListener
              onRecordingComplete={onVoiceMessage}
              onTranscriptionReceived={onTranscriptionReceived}
            />
          </View>
        )}

        {/* Text Input */}
        <ChatInput
          onSendMessage={onSendMessage}
          onVoicePress={handleVoicePress}
          isLoading={isLoading}
          showVoiceButton={false} // We're using the VoiceListener component instead
        />
      </View>
    </View>
  );
}

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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
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
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8E8E93",
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  voiceContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
});
