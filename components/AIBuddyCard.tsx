import { useColorScheme } from "@/hooks/useColorScheme";
import { AIBuddy } from "@/services/aiBuddyService";
import { TTSService } from "@/services/ttsService";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Orb from "./Orb";
import { Text, H5 } from "./typography";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

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
    return [Colors[colorScheme ?? "light"].gradientStart, Colors[colorScheme ?? "light"].gradientEnd];
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
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
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        {/* Glow effect for selected state */}
        {isSelected && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
                backgroundColor: getGradientColors()[0],
              },
            ]}
          />
        )}

        {/* Main card container - soft gradient style */}
        <View style={[styles.container, isDark && styles.containerDark]}>
          {/* Gradient background */}

          {/* Gradient accent border for selected state */}
          {isSelected && (
            <LinearGradient
              colors={getGradientColors()}
              style={styles.selectedBorder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          )}

          {/* Compact content layout */}
          <View style={styles.content}>
            {/* Left side - Orb */}
            <View style={styles.orbContainer}>
              {(() => {
                return (
                  <Orb
                    size={56}
                    colors={getGradientColors()}
                    color={Colors[colorScheme ?? "light"].gradientPink}
                    animated={true}
                    isSpeaking={isPlaying}
                  />
                );
              })()}
              
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
                  backgroundColor: isDark ? "rgba(255, 183, 210, 0.1)" : "rgba(255, 183, 210, 0.2)",
                },
              ]}
              onPress={handlePlayVoice}
              disabled={!(buddy.voice as any)?.elevenlabs_voice_id && !(buddy.voice as any)?.voice_id}
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
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 28,
    opacity: 0.3,
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
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    borderWidth: 3,
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