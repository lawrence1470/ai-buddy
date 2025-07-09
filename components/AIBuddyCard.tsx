import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AIBuddy } from "@/services/aiBuddyService";
import { TTSService } from "@/services/ttsService";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";
import Orb from "./Orb";
import { H5, Text } from "./typography";

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
  const isDark = false; // Force light mode as per useColorScheme hook
  const [isPlaying, setIsPlaying] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Start glow animation for selected state
  React.useEffect(() => {
    if (isSelected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [isSelected, glowAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    onPress?.(buddy);
  };

  const handlePlayVoice = async (e: any) => {
    e.stopPropagation();
    if (isPlaying) return;

    try {
      setIsPlaying(true);

      const sampleText =
        buddy.sample_responses?.[0] ||
        `Hello! I'm ${buddy.name}. ${buddy.personality?.description}`;

      const voiceData = buddy.voice as any;
      const voiceId = voiceData?.elevenlabs_voice_id || voiceData?.voice_id;

      if (!voiceId) {
        console.warn("No voice ID available for", buddy.name);
        return;
      }

      await TTSService.speakText(sampleText, buddy);
    } catch (error) {
      console.error("Error playing voice sample:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const getGradientColors = (): [string, string] => {
    // Use backend color scheme if available, otherwise fallback to constants
    if (buddy.avatar?.color_scheme && buddy.avatar.color_scheme.length >= 2) {
      return [buddy.avatar.color_scheme[0], buddy.avatar.color_scheme[1]];
    }
    // Since colorScheme is always 'light', use light theme
    return [Colors.light.gradientStart, Colors.light.gradientEnd];
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        {/* Glow effect for selected state */}
        {isSelected && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
                backgroundColor: Colors.light.tint,
              },
            ]}
          />
        )}

        {/* Main card container - soft gradient style */}
        <View style={[styles.container, isDark && styles.containerDark]}>
          {/* Gradient background */}

          {/* Consistent selection border */}
          {isSelected && (
            <View
              style={[
                styles.selectedBorder,
                {
                  backgroundColor: Colors.light.tint,
                },
              ]}
            />
          )}

          {/* Compact content layout */}
          <View style={styles.content}>
            {/* Left side - Orb */}
            <View style={styles.orbContainer}>
              <Orb
                size={56}
                colors={getGradientColors()}
                color={getGradientColors()[0]}
                animated={true}
                isSpeaking={isPlaying}
              />

              {/* Selected indicator */}
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}
            </View>

            {/* Center - Name and minimal info */}
            <View style={styles.textContent}>
              <H5
                lightColor={Colors.light.text}
                darkColor={Colors.dark.text}
                style={styles.name}
                numberOfLines={1}
              >
                {buddy.name}
              </H5>

              <View style={styles.infoRow}>
                {buddy.personality?.mbti_type && (
                  <Text
                    variant="caption"
                    lightColor={Colors.light.textSecondary}
                    darkColor={Colors.dark.textSecondary}
                    style={styles.tag}
                  >
                    {buddy.personality.mbti_type}
                  </Text>
                )}
                {buddy.voice?.accent && (
                  <Text
                    variant="caption"
                    lightColor={Colors.light.textSecondary}
                    darkColor={Colors.dark.textSecondary}
                    style={styles.tag}
                  >
                    • {buddy.voice.accent}
                  </Text>
                )}
              </View>
            </View>

            {/* Right side - Play button */}
            <Pressable
              style={[
                styles.playButton,
                isPlaying && styles.playButtonActive,
                {
                  backgroundColor: isDark
                    ? "rgba(255, 183, 210, 0.1)"
                    : "rgba(255, 183, 210, 0.2)",
                },
              ]}
              onPress={handlePlayVoice}
              disabled={
                !(buddy.voice as any)?.elevenlabs_voice_id &&
                !(buddy.voice as any)?.voice_id
              }
            >
              <Ionicons
                name={isPlaying ? "volume-high" : "play"}
                size={18}
                color={isDark ? Colors.dark.text : Colors.light.text}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  pressable: {
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.9,
  },
  glowEffect: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 24,
    opacity: 0.2,
  },
  container: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.light.cardBackground,
    height: 88,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  containerDark: {
    backgroundColor: Colors.dark.cardBackground,
  },
  selectedBorder: {
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 21,
    borderWidth: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: "100%",
  },
  orbContainer: {
    position: "relative",
    marginRight: 14,
  },
  selectedBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  textContent: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    opacity: 0.7,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  playButtonActive: {
    backgroundColor: "rgba(255, 183, 210, 0.3)",
  },
});
