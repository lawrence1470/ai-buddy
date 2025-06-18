import { useColorScheme } from "@/hooks/useColorScheme";
import { AIBuddy } from "@/services/aiBuddyService";
import { TTSService } from "@/services/ttsService";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Orb from "./Orb";
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
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = () => {
    onPress?.(buddy);
  };

  const handlePlayVoice = async () => {
    if (isPlaying) return;

    try {
      setIsPlaying(true);

      // Get a sample response to play
      const sampleText =
        buddy.sample_responses?.[0] ||
        `Hello! I'm ${buddy.name}. ${buddy.personality?.description}`;

      // Debug: Log detailed buddy data structure
      console.log("=== AIBuddyCard Debug ===");
      console.log("Buddy name:", buddy.name);
      console.log("Buddy voice object:", buddy.voice);

      // Check for both possible voice ID fields
      const voiceData = buddy.voice as any;
      const voiceId = voiceData?.elevenlabs_voice_id || voiceData?.voice_id;

      console.log(
        "Voice ID (elevenlabs_voice_id):",
        voiceData?.elevenlabs_voice_id
      );
      console.log("Voice ID (voice_id):", voiceData?.voice_id);
      console.log("Selected voice ID:", voiceId);
      console.log("========================");

      // Check if voice data is available
      if (!voiceId) {
        console.warn(
          "⚠️ No elevenlabs_voice_id available from backend for",
          buddy.name
        );
        console.warn(
          "Voice sample cannot be played without backend voice configuration"
        );
        return;
      }

      // Play the voice sample using the buddy's voice characteristics
      await TTSService.speakText(sampleText, buddy);
    } catch (error) {
      console.error("Error playing voice sample:", error);
    } finally {
      setIsPlaying(false);
    }
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
      {/* Header with Orb */}
      <LinearGradient
        colors={getGradientColors()}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.avatarContainer}>
          <Orb
            size={60}
            colors={buddy.avatar?.color_scheme}
            color={buddy.avatar?.color_scheme?.[0] || "#667EEA"}
            animated={true}
            isSpeaking={isPlaying}
          />
        </View>

        {/* Play Button */}
        <Pressable
          style={[
            styles.playButton,
            {
              backgroundColor: isPlaying
                ? "#10B981"
                : (buddy.voice as any)?.elevenlabs_voice_id ||
                  (buddy.voice as any)?.voice_id
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(255, 0, 0, 0.3)", // Red background if no voice
            },
          ]}
          onPress={handlePlayVoice}
          disabled={
            isPlaying ||
            (!(buddy.voice as any)?.elevenlabs_voice_id &&
              !(buddy.voice as any)?.voice_id)
          }
        >
          <ThemedText style={styles.playButtonText}>
            {isPlaying
              ? "🔊"
              : !(buddy.voice as any)?.elevenlabs_voice_id &&
                !(buddy.voice as any)?.voice_id
              ? "🚫"
              : "▶️"}
          </ThemedText>
        </Pressable>

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
              &ldquo;{buddy.sample_responses[0]}&rdquo;
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
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    fontSize: 28,
  },
  playButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  playButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
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
