import { useAuth } from "@/hooks/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AuthModal({ visible, onClose }: AuthModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { signInWithOTP, verifyOTP, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const result = await signInWithOTP(email.trim());
    if (result.success) {
      setStep("otp");
      Alert.alert(
        "Check your email",
        "We sent you a 6-digit code. Enter it below to sign in."
      );
    } else {
      Alert.alert("Error", result.error || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      Alert.alert("Error", "Please enter the 6-digit code");
      return;
    }

    const result = await verifyOTP(email, otpCode.trim());
    if (result.success) {
      Alert.alert("Success", "You are now signed in!");
      onClose();
      resetForm();
    } else {
      Alert.alert("Error", result.error || "Invalid code");
    }
  };

  const resetForm = () => {
    setEmail("");
    setOtpCode("");
    setStep("email");
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View
            style={[
              styles.modal,
              { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <ThemedText
                style={[
                  styles.title,
                  { color: isDark ? "#FFFFFF" : "#000000" },
                ]}
              >
                Sign In
              </ThemedText>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <ThemedText style={styles.closeText}>✕</ThemedText>
              </Pressable>
            </View>

            {step === "email" ? (
              <>
                <ThemedText
                  style={[
                    styles.subtitle,
                    { color: isDark ? "#8E8E93" : "#666666" },
                  ]}
                >
                  Enter your email to receive a sign-in code
                </ThemedText>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
                      color: isDark ? "#FFFFFF" : "#000000",
                      borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
                    },
                  ]}
                  placeholder="Email address"
                  placeholderTextColor={isDark ? "#8E8E93" : "#8E8E93"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: "#667EEA" },
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleSendOTP}
                  disabled={loading}
                >
                  <ThemedText style={styles.buttonText}>
                    {loading ? "Sending..." : "Send Code"}
                  </ThemedText>
                </Pressable>
              </>
            ) : (
              <>
                <ThemedText
                  style={[
                    styles.subtitle,
                    { color: isDark ? "#8E8E93" : "#666666" },
                  ]}
                >
                  Enter the 6-digit code we sent to {email}
                </ThemedText>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
                      color: isDark ? "#FFFFFF" : "#000000",
                      borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
                      textAlign: "center",
                      fontSize: 24,
                      letterSpacing: 8,
                    },
                  ]}
                  placeholder="000000"
                  placeholderTextColor={isDark ? "#8E8E93" : "#8E8E93"}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />

                <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: "#667EEA" },
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                >
                  <ThemedText style={styles.buttonText}>
                    {loading ? "Verifying..." : "Verify Code"}
                  </ThemedText>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => setStep("email")}
                >
                  <ThemedText
                    style={[
                      styles.buttonText,
                      { color: isDark ? "#FFFFFF" : "#667EEA" },
                    ]}
                  >
                    Back to Email
                  </ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
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
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modal: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: "#666666",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
