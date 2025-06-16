import { useColorScheme } from "@/hooks/useColorScheme";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
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

interface PhoneAuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PhoneAuthModal({
  visible,
  onClose,
}: PhoneAuthModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [loading, setLoading] = useState(false);
  const [pendingSignIn, setPendingSignIn] = useState<any>(null);
  const [pendingSignUp, setPendingSignUp] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSendCode = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      // Format phone number (add +1 if not present)
      const cleanPhone = phone.replace(/\D/g, "");
      const formattedPhone = phone.startsWith("+") ? phone : `+1${cleanPhone}`;

      console.log("Original phone:", phone);
      console.log("Formatted phone:", formattedPhone);

      // First try to sign in
      if (signIn) {
        try {
          const signInAttempt = await signIn.create({
            identifier: formattedPhone,
          });

          // Try to prepare first factor - let Clerk handle the details
          try {
            await signInAttempt.prepareFirstFactor({
              strategy: "phone_code",
            } as any);
          } catch (prepareError) {
            // If the simple approach fails, try with phoneNumberId
            const factors = signInAttempt.supportedFirstFactors || [];
            const phoneCodeFactor = factors.find(
              (factor: any) => factor.strategy === "phone_code"
            );

            if (phoneCodeFactor && (phoneCodeFactor as any).phoneNumberId) {
              await signInAttempt.prepareFirstFactor({
                strategy: "phone_code",
                phoneNumberId: (phoneCodeFactor as any).phoneNumberId,
              } as any);
            } else {
              throw prepareError;
            }
          }

          setPendingSignIn(signInAttempt);
          setIsSignUp(false);
          setStep("code");
          setLoading(false);
          Alert.alert(
            "Code Sent!",
            "Check your phone for the verification code"
          );
          return;
        } catch (signInError: any) {
          // If sign in fails because account doesn't exist, try sign up
          if (
            signInError.errors?.[0]?.code === "form_identifier_not_found" ||
            signInError.message?.includes("Couldn't find your account")
          ) {
            console.log("Account not found, trying sign up...");
          } else {
            throw signInError;
          }
        }
      }

      // Try to sign up if sign in failed
      if (signUp) {
        const signUpAttempt = await signUp.create({
          phoneNumber: formattedPhone,
        });

        await signUpAttempt.preparePhoneNumberVerification({
          strategy: "phone_code",
        });

        setPendingSignUp(signUpAttempt);
        setIsSignUp(true);
        setStep("code");
        setLoading(false);
        Alert.alert("Code Sent!", "Check your phone for the verification code");
      } else {
        throw new Error("Neither sign in nor sign up available");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Phone authentication error:", error);
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || error.message || "Failed to send code"
      );
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp && pendingSignUp) {
        console.log("Attempting sign up verification...");
        // Handle sign up verification
        const completeSignUp =
          await pendingSignUp.attemptPhoneNumberVerification({
            code,
          });

        console.log("Sign up verification result:", {
          status: completeSignUp.status,
          sessionId: completeSignUp.createdSessionId,
          userId: completeSignUp.createdUserId,
        });

        if (completeSignUp.status === "complete") {
          if (setActive && completeSignUp.createdSessionId) {
            await setActive({ session: completeSignUp.createdSessionId });
          }
          setLoading(false);
          handleClose();
          Alert.alert(
            "Welcome!",
            "Your account has been created and you're now signed in!"
          );
        } else {
          // For any other status, log it and show a helpful error
          console.log("Sign up status:", completeSignUp.status);
          console.log("Sign up object:", completeSignUp);

          // Check if password is missing and try to handle it
          if (
            completeSignUp.status === "missing_requirements" &&
            completeSignUp.missingFields?.includes("password")
          ) {
            try {
              console.log("Password required, attempting to update sign-up...");
              // Try to update the sign-up without password or with a generated one
              const updatedSignUp = await pendingSignUp.update({
                // Don't include password - let Clerk handle it
              });

              if (updatedSignUp.status === "complete") {
                if (setActive && updatedSignUp.createdSessionId) {
                  await setActive({ session: updatedSignUp.createdSessionId });
                }
                setLoading(false);
                handleClose();
                Alert.alert(
                  "Welcome!",
                  "Your account has been created and you're now signed in!"
                );
                return;
              } else {
                // If update doesn't work, show helpful message
                setLoading(false);
                Alert.alert(
                  "Setup Required",
                  "Your Clerk dashboard requires a password. Please go to User & Authentication → Email, Phone, Username and disable the 'Password' requirement for phone-only authentication."
                );
                return;
              }
            } catch (updateError: any) {
              console.error("Sign-up update error:", updateError);
              setLoading(false);
              Alert.alert(
                "Setup Required",
                "Your Clerk dashboard requires a password. Please go to User & Authentication → Email, Phone, Username and disable the 'Password' requirement for phone-only authentication."
              );
              return;
            }
          }

          // Try to get more specific error information
          const statusMessage =
            completeSignUp.status === "missing_requirements"
              ? `Missing required information: ${
                  completeSignUp.missingFields?.join(", ") || "unknown"
                }. Please check your Clerk dashboard settings.`
              : `Sign up status: ${completeSignUp.status}`;

          setLoading(false);
          Alert.alert("Authentication Error", statusMessage);
        }
      } else if (!isSignUp && pendingSignIn) {
        console.log("Attempting sign in verification...");
        // Handle sign in verification
        const completeSignIn = await pendingSignIn.attemptFirstFactor({
          strategy: "phone_code",
          code,
        });

        console.log("Sign in verification result:", {
          status: completeSignIn.status,
          sessionId: completeSignIn.createdSessionId,
        });

        if (completeSignIn.status === "complete") {
          if (setActive && completeSignIn.createdSessionId) {
            await setActive({ session: completeSignIn.createdSessionId });
          }
          setLoading(false);
          handleClose();
          Alert.alert("Success!", "You're now signed in!");
        } else {
          setLoading(false);
          Alert.alert("Error", `Sign in status: ${completeSignIn.status}`);
        }
      } else {
        throw new Error("No pending authentication found");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("OTP verification error:", error);
      console.error("Error details:", {
        message: error.message,
        errors: error.errors,
        code: error.code,
        status: error.status,
      });

      // Show more specific error message
      const errorMessage =
        error.errors?.[0]?.message ||
        error.message ||
        "Invalid verification code. Please try again.";

      Alert.alert("Verification Failed", errorMessage);
    }
  };

  const handleClose = () => {
    onClose();
    setPhone("");
    setCode("");
    setStep("phone");
    setPendingSignIn(null);
    setPendingSignUp(null);
    setIsSignUp(false);
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setCode("");
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
                {step === "phone" ? "Sign In" : "Enter Code"}
              </ThemedText>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <ThemedText style={styles.closeText}>✕</ThemedText>
              </Pressable>
            </View>

            {step === "phone" ? (
              <>
                {/* Phone Step */}
                <ThemedText
                  style={[
                    styles.subtitle,
                    { color: isDark ? "#8E8E93" : "#666666" },
                  ]}
                >
                  Enter your phone number to receive a verification code
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
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor={isDark ? "#8E8E93" : "#8E8E93"}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  onSubmitEditing={handleSendCode}
                  returnKeyType="send"
                  autoCorrect={false}
                  spellCheck={false}
                  autoCapitalize="none"
                />

                <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: "#667EEA" },
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleSendCode}
                  disabled={loading}
                >
                  <ThemedText style={styles.buttonText}>
                    {loading ? "Sending..." : "Send Code"}
                  </ThemedText>
                </Pressable>
              </>
            ) : (
              <>
                {/* Code Step */}
                <ThemedText
                  style={[
                    styles.subtitle,
                    { color: isDark ? "#8E8E93" : "#666666" },
                  ]}
                >
                  Enter the 6-digit code sent to {phone}
                </ThemedText>

                <TextInput
                  style={[
                    styles.input,
                    styles.codeInput,
                    {
                      backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7",
                      color: isDark ? "#FFFFFF" : "#000000",
                      borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
                    },
                  ]}
                  placeholder="123456"
                  placeholderTextColor={isDark ? "#8E8E93" : "#8E8E93"}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  onSubmitEditing={handleVerifyCode}
                  returnKeyType="done"
                  autoFocus
                  autoCorrect={false}
                  spellCheck={false}
                  autoCapitalize="none"
                />

                <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: "#667EEA" },
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleVerifyCode}
                  disabled={loading}
                >
                  <ThemedText style={styles.buttonText}>
                    {loading ? "Verifying..." : "Verify Code"}
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={handleBackToPhone}
                  style={styles.backButton}
                >
                  <ThemedText
                    style={[
                      styles.backText,
                      { color: isDark ? "#8E8E93" : "#666666" },
                    ]}
                  >
                    ← Back to phone number
                  </ThemedText>
                </Pressable>
              </>
            )}

            {/* Info Text */}
            <ThemedText
              style={[
                styles.infoText,
                { color: isDark ? "#8E8E93" : "#8E8E93" },
              ]}
            >
              {isSignUp
                ? "Creating your account..."
                : "No account? We'll create one for you automatically when you sign in."}
            </ThemedText>
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
  codeInput: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 8,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
