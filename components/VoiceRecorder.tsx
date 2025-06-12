import { useColorScheme } from "@/hooks/useColorScheme";
import { AudioService } from "@/services/audioService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface VoiceRecorderProps {
  isRecording: boolean;
  isVoiceLoading: boolean;
  recordingDuration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isKeyboardVisible?: boolean;
}

export default function VoiceRecorder({
  isRecording,
  isVoiceLoading,
  recordingDuration,
  onStartRecording,
  onStopRecording,
  isKeyboardVisible = false,
}: VoiceRecorderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animation values for voice recording
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;

  // Voice recording animations
  useEffect(() => {
    if (isRecording) {
      // Pulsing animation for the recording indicator
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      // Ripple animations
      const rippleAnimation1 = Animated.loop(
        Animated.sequence([
          Animated.timing(ripple1, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(ripple1, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      const rippleAnimation2 = Animated.loop(
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(ripple2, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(ripple2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      rippleAnimation1.start();
      rippleAnimation2.start();

      return () => {
        pulseAnimation.stop();
        rippleAnimation1.stop();
        rippleAnimation2.stop();
      };
    } else {
      // Reset animations when not recording
      pulseAnim.setValue(1);
      ripple1.setValue(0);
      ripple2.setValue(0);
    }
  }, [isRecording, pulseAnim, ripple1, ripple2]);

  if (isKeyboardVisible) return null;

  return (
    <View style={styles.voiceRecordingContainer}>
      <View style={styles.animationContainer}>
        {/* Ripple effects when recording */}
        {isRecording && (
          <>
            <Animated.View
              style={[
                styles.ripple,
                {
                  transform: [
                    {
                      scale: ripple1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2.2],
                      }),
                    },
                  ],
                  opacity: ripple1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 0],
                  }),
                },
              ]}
            />

            <Animated.View
              style={[
                styles.ripple,
                {
                  transform: [
                    {
                      scale: ripple2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2.2],
                      }),
                    },
                  ],
                  opacity: ripple2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0],
                  }),
                },
              ]}
            />
          </>
        )}

        {/* Voice Record Button */}
        <Animated.View
          style={[
            styles.voiceButton,
            {
              transform: [{ scale: pulseAnim }],
              backgroundColor: isRecording ? "#FF3B30" : "#667EEA",
            },
          ]}
        >
          <Pressable
            style={styles.voiceButtonPressable}
            onPress={isRecording ? onStopRecording : onStartRecording}
            disabled={isVoiceLoading}
          >
            <View style={styles.voiceButtonInner}>
              {isVoiceLoading ? (
                <Ionicons name="hourglass" size={20} color="white" />
              ) : isRecording ? (
                <Ionicons name="stop" size={20} color="white" />
              ) : (
                <Ionicons name="mic" size={20} color="white" />
              )}
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* Recording Status */}
      {(isRecording || isVoiceLoading) && (
        <View style={styles.recordingStatusContainer}>
          <ThemedText
            style={[
              styles.recordingStatusText,
              { color: isDark ? "#FFFFFF" : "#1C1C1E" },
            ]}
          >
            {isVoiceLoading
              ? "Processing voice message..."
              : `Recording ${AudioService.formatDuration(recordingDuration)}`}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  voiceRecordingContainer: {
    alignItems: "center",
    gap: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#F8F6F0",
  },
  animationContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  voiceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  voiceButtonPressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  voiceButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  recordingStatusContainer: {
    alignItems: "center",
  },
  recordingStatusText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
