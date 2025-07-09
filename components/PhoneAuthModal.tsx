import { Typography } from "@/constants/Typography";
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
import { H3, Text } from "./typography";

interface PhoneAuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PhoneAuthModal({
  visible,
  onClose,
}: PhoneAuthModalProps) {
  const colorScheme = useColorScheme();
  const isDark = false; // Force light mode as per useColorScheme hook
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

      console.log("🔍 DEBUG: Phone Authentication Start");
      console.log("Original phone:", phone);
      console.log("Clean phone:", cleanPhone);
      console.log("Formatted phone:", formattedPhone);
      console.log("SignIn available:", !!signIn);
      console.log("SignUp available:", !!signUp);

      // First try to sign in
      if (signIn) {
        try {
          console.log("📞 Attempting sign in with:", formattedPhone);
          const signInAttempt = await signIn.create({
            identifier: formattedPhone,
          });

          console.log("✅ Sign in attempt created:", {
            status: signInAttempt.status,
            identifier: signInAttempt.identifier,
            supportedFirstFactors:
              signInAttempt.supportedFirstFactors?.length || 0,
          });

          // Try to prepare first factor - let Clerk handle the details
          try {
            console.log("📲 Preparing phone code strategy...");
            await signInAttempt.prepareFirstFactor({
              strategy: "phone_code",
            } as any);
            console.log("✅ Phone code preparation successful");
          } catch (prepareError: any) {
            console.log(
              "⚠️ Simple preparation failed, trying with phoneNumberId:",
              prepareError.message
            );
            // If the simple approach fails, try with phoneNumberId
            const factors = signInAttempt.supportedFirstFactors || [];
            console.log(
              "Available factors:",
              factors.map((f: any) => ({
                strategy: f.strategy,
                phoneNumberId: f.phoneNumberId,
              }))
            );

            const phoneCodeFactor = factors.find(
              (factor: any) => factor.strategy === "phone_code"
            );

            if (phoneCodeFactor && (phoneCodeFactor as any).phoneNumberId) {
              console.log(
                "📲 Retrying with phoneNumberId:",
                (phoneCodeFactor as any).phoneNumberId
              );
              await signInAttempt.prepareFirstFactor({
                strategy: "phone_code",
                phoneNumberId: (phoneCodeFactor as any).phoneNumberId,
              } as any);
              console.log("✅ Phone code preparation with ID successful");
            } else {
              console.error("❌ No phone code factor found");
              throw prepareError;
            }
          }

          setPendingSignIn(signInAttempt);
          setIsSignUp(false);
          setStep("code");
          setLoading(false);
          console.log("🎉 SMS should be sent! Moving to verification step");
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
        console.log(
          "👤 Account not found, attempting sign up with:",
          formattedPhone
        );
        const signUpAttempt = await signUp.create({
          phoneNumber: formattedPhone,
        });

        console.log("✅ Sign up attempt created:", {
          status: signUpAttempt.status,
          phoneNumber: signUpAttempt.phoneNumber,
          verifications: signUpAttempt.verifications,
        });

        console.log("📲 Preparing phone number verification...");
        await signUpAttempt.preparePhoneNumberVerification({
          strategy: "phone_code",
        });
        console.log("✅ Phone verification preparation successful");

        setPendingSignUp(signUpAttempt);
        setIsSignUp(true);
        setStep("code");
        setLoading(false);
        console.log(
          "🎉 SMS should be sent for new user! Moving to verification step"
        );
        Alert.alert("Code Sent!", "Check your phone for the verification code");
      } else {
        throw new Error("Neither sign in nor sign up available");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("❌ Phone authentication error:", error);
      console.error("Error details:", {
        message: error.message,
        errors: error.errors,
        code: error.code,
        status: error.status,
        stack: error.stack,
      });

      // More helpful error messages
      let errorMessage = "Failed to send code";
      if (error.errors?.[0]?.message) {
        errorMessage = error.errors[0].message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Add specific troubleshooting info
      const troubleshootingMsg = `
${errorMessage}

Troubleshooting:
• Check your Clerk dashboard settings
• Ensure phone authentication is enabled
• Try a different phone number format
• Check console logs for details`;

      Alert.alert("SMS Code Not Sent", troubleshootingMsg);
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
              { backgroundColor: isDark ? "#000000" : "#FFFFFF" },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <H3 lightColor="#000000" darkColor="#FFFFFF">
                {step === "phone" ? "Sign In" : "Enter Code"}
              </H3>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <ThemedText style={styles.closeText}>✕</ThemedText>
              </Pressable>
            </View>

            {step === "phone" ? (
              <>
                {/* Phone Step */}
                <Text
                  variant="bodySmall"
                  lightColor="#00000080"
                  darkColor="#FFFFFF80"
                  style={{ textAlign: "center", marginBottom: 24 }}
                >
                  Enter your phone number to receive a verification code
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? "#0A0A0A" : "#FAFAFA",
                      color: isDark ? "#FFFFFF" : "#000000",
                      borderColor: isDark ? "#FFFFFF10" : "#00000010",
                      textAlign: "center",
                    },
                  ]}
                  placeholder="Phone number"
                  placeholderTextColor={isDark ? "#FFFFFF50" : "#00000050"}
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
                    { backgroundColor: "#00D9FF" },
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
                <Text
                  variant="bodySmall"
                  lightColor="#00000080"
                  darkColor="#FFFFFF80"
                  style={{ textAlign: "center", marginBottom: 24 }}
                >
                  Enter the 6-digit code sent to {phone}
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    styles.codeInput,
                    {
                      backgroundColor: isDark ? "#0A0A0A" : "#FAFAFA",
                      color: isDark ? "#FFFFFF" : "#000000",
                      borderColor: isDark ? "#FFFFFF10" : "#00000010",
                    },
                  ]}
                  placeholder="123456"
                  placeholderTextColor={isDark ? "#FFFFFF50" : "#00000050"}
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
                    { backgroundColor: "#00D9FF" },
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
                      { color: isDark ? "#FFFFFF80" : "#00000080" },
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
                { color: isDark ? "#FFFFFF50" : "#00000050" },
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
    borderRadius: 0,
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: "#00000080",
  },
  input: {
    height: 50,
    borderRadius: 0,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    ...Typography.input,
    letterSpacing: 0,
  },
  codeInput: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 4, // Reduced from 8 to 4 for better readability
  },
  button: {
    height: 50,
    borderRadius: 0,
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
