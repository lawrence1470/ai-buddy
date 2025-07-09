import SparkleIcon from "@/components/icons/SparkleIcon";
import { ThemedText } from "@/components/ThemedText";
import { H3 } from "@/components/typography";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useColorScheme } from "@/hooks/useColorScheme";
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

  const [firstName, setFirstName] = useState("");

  // Update firstName when user data loads
  useEffect(() => {
    if (user?.firstName) {
      setFirstName(user.firstName);
    }
  }, [user?.firstName]);

  const placeholderText = "Your name";

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "Please tell us what to call you");
      return;
    }

    setIsLoading(true);
    try {
      // Update Clerk profile only
      await user?.update({
        firstName: firstName.trim(),
      });

      Alert.alert("Success!", "Your profile has been updated", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Profile update error:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
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
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <SparkleIcon size={32} color="#FFFFFF" />
            </View>
          </View>

          <H3
            style={{
              color: Colors[colorScheme ?? "light"].textSecondary,
              textAlign: "center",
              marginBottom: 40,
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
                    backgroundColor:
                      Colors[colorScheme ?? "light"].cardBackground,
                    color: Colors[colorScheme ?? "light"].text,
                    borderColor: Colors[colorScheme ?? "light"].border,
                    textAlign: "center",
                  },
                ]}
                placeholder={firstName ? "" : placeholderText}
                placeholderTextColor={Colors.dark.textTertiary}
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
