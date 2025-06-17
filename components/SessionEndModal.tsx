import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

interface SessionEndModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  messageCount?: number;
  sessionDuration?: string;
}

export default function SessionEndModal({
  visible,
  onConfirm,
  onCancel,
  messageCount = 0,
  sessionDuration,
}: SessionEndModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
              borderColor: isDark ? "#2C2C2E" : "#E5E5EA",
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText
              style={[styles.title, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
            >
              End Session?
            </ThemedText>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ThemedText
              style={[
                styles.message,
                { color: isDark ? "#D1D1D6" : "#3C3C43" },
              ]}
            >
              Are you sure you want to end this chat session? Your conversation
              will be saved in your history.
            </ThemedText>

            {/* Session Info */}
            {messageCount > 0 && (
              <View style={styles.sessionInfo}>
                <View style={styles.infoRow}>
                  <ThemedText
                    style={[
                      styles.infoLabel,
                      { color: isDark ? "#8E8E93" : "#8E8E93" },
                    ]}
                  >
                    Messages:
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.infoValue,
                      { color: isDark ? "#FFFFFF" : "#1C1C1E" },
                    ]}
                  >
                    {messageCount}
                  </ThemedText>
                </View>

                {sessionDuration && (
                  <View style={styles.infoRow}>
                    <ThemedText
                      style={[
                        styles.infoLabel,
                        { color: isDark ? "#8E8E93" : "#8E8E93" },
                      ]}
                    >
                      Duration:
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.infoValue,
                        { color: isDark ? "#FFFFFF" : "#1C1C1E" },
                      ]}
                    >
                      {sessionDuration}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
                  borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
                },
              ]}
              onPress={onCancel}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: isDark ? "#FFFFFF" : "#1C1C1E" },
                ]}
              >
                Continue Chat
              </ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: "#FF3B30" },
              ]}
              onPress={onConfirm}
            >
              <ThemedText style={[styles.buttonText, { color: "#FFFFFF" }]}>
                End Session
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: width - 40,
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  sessionInfo: {
    backgroundColor: "rgba(142, 142, 147, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // Red background set inline
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
