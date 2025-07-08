import { useColorScheme } from "@/hooks/useColorScheme";
import { AIBuddy } from "@/services/aiBuddyService";
import { TTSService } from "@/services/ttsService";
import { BlurView } from "expo-blur";
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

  const getGradientColors = (): [string, string, string] => {
    const colorSchema = (buddy as any).color_schema;
    if (colorSchema?.primary && colorSchema?.secondary) {
      return [colorSchema.primary, colorSchema.secondary, colorSchema.primary + "40"];
    }
    return ["#667EEA", "#764BA2", "#667EEA40"];
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

        {/* Main card container - now more compact */}
        <View style={[styles.container, isDark && styles.containerDark]}>
          {/* Glass background */}
          {Platform.OS === "ios" ? (
            <BlurView intensity={60} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill}>
              <View style={[styles.glassOverlay, isDark && styles.glassOverlayDark]} />
            </BlurView>
          ) : (
            <View style={[styles.androidGlass, isDark && styles.androidGlassDark]} />
          )}

          {/* Gradient accent line */}
          <LinearGradient
            colors={getGradientColors()}
            style={styles.gradientAccent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />

          {/* Compact content layout */}
          <View style={styles.content}>
            {/* Left side - Orb */}
            <View style={styles.orbContainer}>
              {(() => {
                const colorSchema = (buddy as any).color_schema;
                const orbColor = colorSchema?.primary || "#667EEA";
                const orbColors = colorSchema
                  ? [colorSchema.primary, colorSchema.secondary]
                  : undefined;

                return (
                  <Orb
                    size={56}
                    colors={orbColors}
                    color={orbColor}
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
                lightColor="#1C1C1E"
                darkColor="#FFFFFF"
                style={styles.name}
                numberOfLines={1}
              >
                {buddy.name}
              </H5>
              
              <View style={styles.infoRow}>
                {buddy.personality?.mbti_type && (
                  <Text
                    variant="caption"
                    lightColor="#666666"
                    darkColor="#999999"
                    style={styles.tag}
                  >
                    {buddy.personality.mbti_type}
                  </Text>
                )}
                {buddy.voice?.accent && (
                  <Text
                    variant="caption"
                    lightColor="#666666"
                    darkColor="#999999"
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
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.05)",
                },
              ]}
              onPress={handlePlayVoice}
              disabled={!(buddy.voice as any)?.elevenlabs_voice_id && !(buddy.voice as any)?.voice_id}
            >
              <Ionicons
                name={isPlaying ? "volume-high" : "play"}
                size={18}
                color={isDark ? "#FFFFFF" : "#1C1C1E"}
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
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 35,
    opacity: 0.3,
  },
  container: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    height: 88, // Fixed compact height
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  containerDark: {
    backgroundColor: "rgba(28, 28, 30, 0.9)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  glassOverlayDark: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  androidGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
  },
  androidGlassDark: {
    backgroundColor: "rgba(28, 28, 30, 0.92)",
  },
  gradientAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
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
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  playButtonActive: {
    backgroundColor: "rgba(16, 185, 129, 0.15) !important",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
});