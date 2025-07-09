import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  onVoicePress?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  showVoiceButton?: boolean;
}

export default function ChatInput({
  onSendMessage,
  onVoicePress,
  isLoading = false,
  placeholder = "Type a message...",
  maxLength = 1000,
  disabled = false,
  showVoiceButton = true,
}: ChatInputProps) {
  const [inputText, setInputText] = useState("");
  const colorScheme = useColorScheme();
  const isDark = false; // Force light mode as per useColorScheme hook

  const handleSendMessage = useCallback(() => {
    if (inputText.trim() && onSendMessage && !disabled) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  }, [inputText, onSendMessage, disabled]);

  const handleVoicePress = useCallback(() => {
    if (onVoicePress && !disabled) {
      onVoicePress();
    }
  }, [onVoicePress, disabled]);

  const canSend = inputText.trim().length > 0 && !isLoading && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        {/* Voice Button */}
        {showVoiceButton && (
          <Pressable
            style={[
              styles.voiceButton,
              {
                backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
                borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
              },
            ]}
            onPress={handleVoicePress}
            disabled={disabled}
          >
            <ThemedText style={styles.voiceIcon}>🎤</ThemedText>
          </Pressable>
        )}

        {/* Text Input */}
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
              color: isDark ? "#FFFFFF" : "#000000",
              borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
              textAlign: inputText ? "left" : "center",
            },
            !showVoiceButton && styles.textInputFullWidth,
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#8E8E93" : "#8E8E93"}
          multiline
          maxLength={maxLength}
          onSubmitEditing={
            Platform.OS === "ios" ? handleSendMessage : undefined
          }
          blurOnSubmit={Platform.OS === "ios"}
          editable={!disabled}
          returnKeyType="send"
          textAlignVertical="center"
        />

        {/* Send Button */}
        <Pressable
          style={[
            styles.sendButton,
            {
              backgroundColor: canSend ? "#007AFF" : "#8E8E93",
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          onPress={handleSendMessage}
          disabled={!canSend}
        >
          <ThemedText style={styles.sendButtonText}>
            {isLoading ? "..." : "➤"}
          </ThemedText>
        </Pressable>
      </View>

      {/* Character Counter */}
      {inputText.length > maxLength * 0.8 && (
        <View style={styles.counterContainer}>
          <ThemedText
            style={[
              styles.counterText,
              {
                color:
                  inputText.length >= maxLength
                    ? "#FF3B30"
                    : isDark
                    ? "#8E8E93"
                    : "#8E8E93",
              },
            ]}
          >
            {inputText.length}/{maxLength}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  voiceIcon: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 44,
    textAlignVertical: "center",
  },
  textInputFullWidth: {
    marginLeft: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  counterContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    paddingRight: 8,
  },
  counterText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
