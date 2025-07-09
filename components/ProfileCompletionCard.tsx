import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import SparkleIcon from "./icons/SparkleIcon";

interface ProfileCompletionCardProps {
  onPress?: () => void;
}

export default function ProfileCompletionCard({
  onPress,
}: ProfileCompletionCardProps) {
  const colorScheme = useColorScheme();
  const { user } = useUser();
  const isDark = colorScheme === "dark";

  // Check if user has completed their profile using Clerk data
  const hasCompletedProfile = user?.firstName && user.firstName.trim().length > 0;

  // Don't show the card if:
  // - User is not signed in
  // - User has already completed their profile (has firstName)
  if (!user || hasCompletedProfile) {
    return null;
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to profile completion screen
      router.push("/profile-setup");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.card} onPress={handlePress}>
        <View style={styles.cardContent}>
          <SparkleIcon size={20} color="#FFB4D2" />
          <View style={styles.completeBadge}>
            <ThemedText style={styles.completeBadgeText}>Complete</ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.cardTitle, { color: "#1C1C1E" }]}>
          Complete profile
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  completeBadge: {
    backgroundColor: "#667EEA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  completeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
