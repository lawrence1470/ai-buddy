import Chat from "@/components/Chat";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ChatMessage } from "@/services/chatService";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const handleMessageSent = (message: ChatMessage) => {
    console.log("Message sent:", message.text);
  };

  const handleAIResponse = (message: ChatMessage) => {
    console.log("AI responded:", message.text);
  };

  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#FFFFFF" },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.chatWrapper}>
          <Chat
            messages={messages}
            onMessageSent={handleMessageSent}
            onAIResponse={handleAIResponse}
            isKeyboardVisible={isKeyboardVisible}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
  },
});
