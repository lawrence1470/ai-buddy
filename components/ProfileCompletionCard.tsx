import { useColorScheme } from "@/hooks/useColorScheme";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ProfileCompletionCardProps {
  onPress?: () => void;
}

export default function ProfileCompletionCard({
  onPress,
}: ProfileCompletionCardProps) {
  const colorScheme = useColorScheme();
  const { user } = useUser();
  const isDark = colorScheme === "dark";

  // Check if user needs to complete profile
  const needsProfileCompletion = !user?.firstName || !user?.lastName;

  if (!needsProfileCompletion) {
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
          <ThemedText style={styles.cardIcon}>✨</ThemedText>
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
    backgroundColor: "#F8F6F0",
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
