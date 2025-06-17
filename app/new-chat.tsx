import Chat, { ChatRef } from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import Orb from "@/components/Orb";
import SessionEndModal from "@/components/SessionEndModal";
import { ThemedText } from "@/components/ThemedText";
import { useAISpeaking } from "@/hooks/useAISpeaking";
import { ChatMessage } from "@/services/chatService";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [sessionStartTime] = useState<Date>(new Date());
  const isSpeaking = useAISpeaking();
  const chatRef = useRef<ChatRef>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const formatSessionDuration = (): string => {
    const now = new Date();
    const diffMs = now.getTime() - sessionStartTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (diffMinutes > 0) {
      return `${diffMinutes}m ${diffSeconds}s`;
    }
    return `${diffSeconds}s`;
  };

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    try {
      await chatRef.current?.sendTextMessage(text);
    } catch (error) {
      console.error("Failed to send text message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageSent = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    console.log("Message sent:", message);
  };

  const handleAIResponse = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    console.log("AI response:", message);
  };

  const handleVoicePress = () => {
    console.log("Voice button pressed");
  };

  // Show confirmation modal when close button is pressed
  const handleClosePress = () => {
    // Only show modal if there are messages (active session)
    if (messages.length > 0) {
      setShowEndSessionModal(true);
    } else {
      // If no messages, just close directly
      router.back();
    }
  };

  // Confirm ending the session
  const handleConfirmEndSession = () => {
    setShowEndSessionModal(false);
    // TODO: Here you can add logic to save the session to backend
    // For now, just navigate back
    router.back();
  };

  // Cancel ending the session
  const handleCancelEndSession = () => {
    setShowEndSessionModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClosePress} style={styles.closeButton}>
            <ThemedText style={styles.closeIcon}>✕</ThemedText>
          </Pressable>
          <ThemedText style={styles.headerTitle}>New Chat</ThemedText>
          <View style={styles.headerRight} />
        </View>

        {/* AI-buddy Section - Hidden when keyboard is visible */}
        {!isKeyboardVisible && (
          <View style={styles.aiBuddySection}>
            <View style={styles.orbContainer}>
              <Orb
                size={120}
                color="#667EEA"
                animated={true}
                isSpeaking={isSpeaking}
              />
            </View>
          </View>
        )}

        {/* Chat Messages */}
        <View
          style={[
            styles.chatSection,
            isKeyboardVisible && styles.chatSectionExpanded,
          ]}
        >
          <Chat
            ref={chatRef}
            messages={messages}
            isLoading={isLoading}
            onMessageSent={handleMessageSent}
            onAIResponse={handleAIResponse}
            isKeyboardVisible={isKeyboardVisible}
          />
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* Text Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onVoicePress={handleVoicePress}
            isLoading={isLoading}
            showVoiceButton={false}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Session End Confirmation Modal */}
      <SessionEndModal
        visible={showEndSessionModal}
        onConfirm={handleConfirmEndSession}
        onCancel={handleCancelEndSession}
        messageCount={messages.length}
        sessionDuration={
          messages.length > 0 ? formatSessionDuration() : undefined
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0",
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#F8F6F0",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  headerRight: {
    width: 32,
  },
  chatSection: {
    flex: 1,
    minHeight: 200,
  },
  chatSectionExpanded: {
    flex: 1,
  },
  aiBuddySection: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
    minHeight: 80,
  },
  orbContainer: {
    marginBottom: 10,
  },
  aiBuddyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#667EEA",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 30,
  },
  inputSection: {
    backgroundColor: "#F8F6F0",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
});
