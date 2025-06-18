import { useColorScheme } from "@/hooks/useColorScheme";
import { AIBuddy } from "@/services/aiBuddyService";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface AIBuddyCardProps {
  buddy: AIBuddy;
  onPress?: (buddy: AIBuddy) => void;
  isSelected?: boolean;
}

export default function AIBuddyCard({
  buddy,
  onPress,
  isSelected = false,
}: AIBuddyCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    onPress?.(buddy);
  };

  const getGradientColors = (): [string, string] => {
    if (buddy.avatar?.color_scheme && buddy.avatar.color_scheme.length >= 2) {
      return [buddy.avatar.color_scheme[0], buddy.avatar.color_scheme[1]];
    }
    return ["#667EEA", "#764BA2"]; // Default gradient
  };

  const formatTraits = (traits?: string[]) => {
    if (!traits || traits.length === 0) return "";
    return traits.slice(0, 3).join(" • "); // Show first 3 traits
  };

  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
      ]}
      onPress={handlePress}
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.avatarContainer}>
          <ThemedText style={styles.avatar}>
            {buddy.avatar?.emoji || "🤖"}
          </ThemedText>
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <ThemedText style={styles.selectedBadgeText}>✓</ThemedText>
          </View>
        )}
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText
          style={[styles.name, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
        >
          {buddy.name}
        </ThemedText>

        <ThemedText
          style={[
            styles.description,
            { color: isDark ? "#8E8E93" : "#666666" },
          ]}
        >
          {buddy.personality?.description}
        </ThemedText>

        {/* MBTI & Voice Info */}
        <View style={styles.infoRow}>
          {buddy.personality?.mbti_type && (
            <View style={[styles.badge, styles.mbtiBadge]}>
              <ThemedText style={styles.badgeText}>
                {buddy.personality.mbti_type}
              </ThemedText>
            </View>
          )}
          {buddy.voice?.accent && (
            <View style={[styles.badge, styles.voiceBadge]}>
              <ThemedText style={styles.badgeText}>
                {buddy.voice.accent} accent
              </ThemedText>
            </View>
          )}
        </View>

        {/* Traits */}
        {buddy.personality?.traits && (
          <ThemedText
            style={[styles.traits, { color: isDark ? "#98A2B3" : "#6B7280" }]}
          >
            {formatTraits(buddy.personality.traits)}
          </ThemedText>
        )}

        {/* Sample Response */}
        {buddy.sample_responses && buddy.sample_responses.length > 0 && (
          <View
            style={[
              styles.sampleContainer,
              { backgroundColor: isDark ? "#2C2C2E" : "#F8F9FA" },
            ]}
          >
            <ThemedText
              style={[
                styles.sampleText,
                { color: isDark ? "#D1D5DB" : "#4B5563" },
              ]}
            >
              " {`"${buddy.sample_responses[0]}"`}"
            </ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: "#667EEA",
    transform: [{ scale: 0.98 }],
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    fontSize: 28,
  },
  selectedBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mbtiBadge: {
    backgroundColor: "#EEF2FF",
  },
  voiceBadge: {
    backgroundColor: "#F0F9FF",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#667EEA",
  },
  traits: {
    fontSize: 12,
    marginBottom: 12,
    fontWeight: "500",
  },
  sampleContainer: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#667EEA",
  },
  sampleText: {
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 18,
  },
});
