import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import Orb from "@/components/Orb";
import { ThemedText } from "@/components/ThemedText";
import { useAISpeaking } from "@/hooks/useAISpeaking";
import { ChatMessage } from "@/services/chatService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const isSpeaking = useAISpeaking();

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

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I received your message: " + text,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleTranscriptionReceived = (text: string) => {
    // Add user message with voice indicator
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      isVoice: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I received your voice message: " + text,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleVoicePress = () => {
    console.log("Voice button pressed");
  };

  const handleClose = () => {
    router.back();
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
          <Pressable onPress={handleClose} style={styles.closeButton}>
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
            messages={messages}
            isLoading={isLoading}
            onMessageSent={(message) => console.log("Message sent:", message)}
            onAIResponse={(message) => console.log("AI response:", message)}
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
