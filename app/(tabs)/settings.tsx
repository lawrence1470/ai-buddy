import PhoneAuthModal from "@/components/PhoneAuthModal";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { signOut, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/profile-setup");
  };

  const settingsItems = [
    {
      id: "account",
      title: "Account",
      subtitle: "Manage your account settings",
      icon: "house.fill",
      onPress: () => Alert.alert("Account", "Account settings coming soon!"),
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Configure your notification preferences",
      icon: "paperplane.fill",
      onPress: () =>
        Alert.alert("Notifications", "Notification settings coming soon!"),
    },
    {
      id: "profile",
      title: "Edit Profile",
      subtitle: "Update your name and personal information",
      icon: "house.fill", // We'll use house.fill for now, can be changed to a person icon later
      onPress: handleEditProfile,
    },
  ];

  // If user is not signed in, show sign-in prompt
  if (!isSignedIn) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
      >
        <ScrollView
          style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
          contentContainerStyle={[styles.scrollContent, { backgroundColor: Colors[colorScheme ?? "light"].background }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText
              style={[
                styles.title,
                {
                  color: isDark ? "#FFFFFF" : "#000000",
                  minHeight: 40,
                  lineHeight: 40,
                },
              ]}
            >
              Settings
            </ThemedText>
          </View>

          {/* Sign In Prompt */}
          <View style={styles.signInPrompt}>
            <View style={styles.signInIconContainer}>
              <ThemedText style={styles.signInIcon}>🔒</ThemedText>
            </View>

            <ThemedText
              style={[
                styles.signInTitle,
                { color: isDark ? "#FFFFFF" : "#000000" },
              ]}
            >
              Sign In Required
            </ThemedText>

            <ThemedText
              style={[
                styles.signInSubtitle,
                { color: isDark ? "#8E8E93" : "#666666" },
              ]}
            >
              Please sign in to access your settings and personalize your AI
              experience.
            </ThemedText>

            <Pressable
              style={styles.signInButton}
              onPress={() => setShowAuthModal(true)}
            >
              <ThemedText style={styles.signInButtonText}>Sign In</ThemedText>
            </Pressable>
          </View>
        </ScrollView>

        {/* Auth Modal */}
        <PhoneAuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </SafeAreaView>
    );
  }

  // If user is signed in, show normal settings
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#F8F6F0" },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText
            style={[
              styles.title,
              {
                color: isDark ? "#FFFFFF" : "#000000",
                minHeight: 40,
                lineHeight: 40,
              },
            ]}
          >
            Settings
          </ThemedText>
        </View>

        {/* Settings Items */}
        <View style={styles.section}>
          {settingsItems.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.settingItem,
                { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
              ]}
              onPress={item.onPress}
            >
              <View style={styles.settingContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isDark ? "#2C2C2E" : "#F2F2F7" },
                  ]}
                >
                  <IconSymbol
                    name={item.icon as any}
                    size={20}
                    color="#667EEA"
                  />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText
                    style={[
                      styles.settingTitle,
                      { color: isDark ? "#FFFFFF" : "#000000" },
                    ]}
                  >
                    {item.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.settingSubtitle,
                      { color: isDark ? "#8E8E93" : "#666666" },
                    ]}
                  >
                    {item.subtitle}
                  </ThemedText>
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={16}
                  color={isDark ? "#8E8E93" : "#C7C7CC"}
                />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Sign Out Section */}
        <View style={styles.section}>
          <Pressable
            style={[
              styles.settingItem,
              styles.signOutItem,
              { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
            ]}
            onPress={handleSignOut}
          >
            <View style={styles.settingContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: "rgba(255, 59, 48, 0.1)" },
                ]}
              >
                <ThemedText style={styles.signOutIcon}>🚪</ThemedText>
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
              </View>
            </View>
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <ThemedText
            style={[
              styles.appInfoText,
              { color: isDark ? "#8E8E93" : "#8E8E93" },
            ]}
          >
            AI Buddy v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  // Sign In Prompt Styles
  signInPrompt: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  signInIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#667EEA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#667EEA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  signInIcon: {
    fontSize: 48,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 48,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  signInSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  signInButton: {
    backgroundColor: "#667EEA",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Regular Settings Styles
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  settingItem: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  signOutItem: {
    marginBottom: 0,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  signOutIcon: {
    fontSize: 18,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  appInfo: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 14,
    textAlign: "center",
  },
});
