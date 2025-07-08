import { ThemedText } from "@/components/ThemedText";
import { Text, H3 } from "@/components/typography";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUpsertUserProfile, useUserProfile } from "@/hooks/useUserProfile";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function ProfileSetupScreen() {
  const colorScheme = useColorScheme();
  const { user } = useUser();
  const isDark = colorScheme === "dark";

  // Get existing profile data
  const { data: existingProfile, isLoading: isProfileLoading } =
    useUserProfile();

  // Mutation for saving profile
  const upsertProfile = useUpsertUserProfile();

  const [firstName, setFirstName] = useState("");

  // Update firstName when profile data loads
  useEffect(() => {
    console.log("Profile data:", existingProfile);
    console.log("User data:", user?.firstName);

    if (existingProfile?.name) {
      console.log("Setting firstName from profile:", existingProfile.name);
      setFirstName(existingProfile.name);
    } else if (user?.firstName) {
      console.log("Setting firstName from Clerk:", user.firstName);
      setFirstName(user.firstName);
    }
  }, [existingProfile?.name, user?.firstName]);

  // Get the current name for placeholder
  const currentName = existingProfile?.name || user?.firstName || "";
  const placeholderText = "Your name";

  console.log("Current firstName state:", firstName);
  console.log("Current placeholderText:", placeholderText);

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "Please tell us what to call you");
      return;
    }

    try {
      await upsertProfile.mutateAsync({ name: firstName.trim() });

      // Also update Clerk profile for consistency
      try {
        await user?.update({
          firstName: firstName.trim(),
        });
      } catch (clerkError) {
        // Continue even if Clerk update fails - Supabase is our source of truth
        console.warn("Failed to update Clerk profile:", clerkError);
      }

      Alert.alert("Success!", "Your profile has been updated", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Profile update error:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  const handleSkip = () => {
    router.back();
  };

  const isLoading = upsertProfile.isPending;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background }
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText
              style={[
                styles.backText,
                { color: Colors[colorScheme ?? "light"].text },
              ]}
            >
              ← Back
            </ThemedText>
          </Pressable>
          <Text
            variant="h5"
            style={{ color: Colors[colorScheme ?? "light"].text }}
          >
            Complete Your Profile
          </Text>
          <Pressable onPress={handleSkip}>
            <ThemedText style={[styles.skipText, { color: Colors.light.gradientStart }]}>Skip</ThemedText>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <ThemedText style={styles.icon}>✨</ThemedText>
            </View>
          </View>

          <H3
            style={{ 
              color: Colors[colorScheme ?? "light"].textSecondary,
              textAlign: "center", 
              marginBottom: 40 
            }}
          >
            What should our AI-buddy call you?
          </H3>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: Colors[colorScheme ?? "light"].cardBackground,
                    color: Colors[colorScheme ?? "light"].text,
                    borderColor: Colors[colorScheme ?? "light"].border,
                    textAlign: firstName ? "center" : "left",
                  },
                ]}
                placeholder={firstName ? "" : placeholderText}
                placeholderTextColor={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
                value={firstName}
                onChangeText={setFirstName}
                autoComplete="given-name"
                returnKeyType="done"
                onSubmitEditing={handleSave}
                autoCorrect={false}
                spellCheck={false}
                autoFocus
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            style={[
              styles.saveButton,
              { backgroundColor: Colors.light.gradientStart },
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <ThemedText style={styles.saveButtonText}>
              {isLoading ? "Saving..." : "Save"}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.gradientPink,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 32,
    color: "#FFFFFF",
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    ...Typography.input,
    letterSpacing: 0,
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
