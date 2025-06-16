import { ThemedText } from "@/components/ThemedText";
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
  const placeholderText = currentName
    ? `Currently: ${currentName}`
    : "Enter your name";

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
        { backgroundColor: isDark ? "#000000" : "#F8F6F0" },
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
                { color: isDark ? "#FFFFFF" : "#1C1C1E" },
              ]}
            >
              ← Back
            </ThemedText>
          </Pressable>
          <ThemedText
            style={[styles.title, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
          >
            Complete Your Profile
          </ThemedText>
          <Pressable onPress={handleSkip}>
            <ThemedText style={styles.skipText}>Skip</ThemedText>
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <ThemedText style={styles.icon}>✨</ThemedText>
            </View>
          </View>

          <ThemedText
            style={[styles.subtitle, { color: isDark ? "#8E8E93" : "#666666" }]}
          >
            What should our AI-buddy call you?
          </ThemedText>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                    color: isDark ? "#FFFFFF" : "#1C1C1E",
                    borderColor: isDark ? "#3A3A3C" : "#E5E5EA",
                  },
                ]}
                placeholder={firstName ? "" : placeholderText}
                placeholderTextColor={isDark ? "#8E8E93" : "#8E8E93"}
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
              { backgroundColor: "#667EEA" },
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  skipText: {
    fontSize: 16,
    color: "#667EEA",
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
    backgroundColor: "#667EEA",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 32,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    fontWeight: "500",
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
    fontSize: 16,
    borderWidth: 1,
    textAlign: "center",
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
