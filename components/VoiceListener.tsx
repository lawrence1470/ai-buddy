import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface VoiceListenerProps {
  onRecordingComplete?: (uri: string) => void;
  onTranscriptionReceived?: (text: string) => void;
}

export default function VoiceListener({
  onRecordingComplete,
  onTranscriptionReceived,
}: VoiceListenerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recording = useRef<Audio.Recording | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useColorScheme();

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;

  // Start animations when recording starts
  useEffect(() => {
    if (isRecording) {
      // Pulsing animation for the main button
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Ripple animations with staggered delays
      const rippleAnimation1 = Animated.loop(
        Animated.sequence([
          Animated.timing(ripple1, {
            toValue: 1,
            duration: 2000,
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
          Animated.delay(400),
          Animated.timing(ripple2, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ripple2, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      const rippleAnimation3 = Animated.loop(
        Animated.sequence([
          Animated.delay(800),
          Animated.timing(ripple3, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(ripple3, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      rippleAnimation1.start();
      rippleAnimation2.start();
      rippleAnimation3.start();

      return () => {
        pulseAnimation.stop();
        rippleAnimation1.stop();
        rippleAnimation2.stop();
        rippleAnimation3.stop();
      };
    } else {
      // Reset animations when not recording
      pulseAnim.setValue(1);
      ripple1.setValue(0);
      ripple2.setValue(0);
      ripple3.setValue(0);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Permission to access microphone is required!"
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording...");
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.current = newRecording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    if (!recording.current) return;

    console.log("Stopping recording...");
    setIsRecording(false);
    setIsLoading(true);

    try {
      // Clear the interval
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }

      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();

      if (uri && onRecordingComplete) {
        onRecordingComplete(uri);
      }

      // Here you could add speech-to-text integration
      // For now, we'll simulate a transcription
      setTimeout(() => {
        if (onTranscriptionReceived) {
          onTranscriptionReceived(
            "This is a simulated transcription. Integrate with a speech-to-text service for real functionality."
          );
        }
        setIsLoading(false);
      }, 1000);

      recording.current = null;
    } catch (error) {
      console.error("Failed to stop recording", error);
      setIsLoading(false);
      Alert.alert("Error", "Failed to stop recording");
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.recordingContainer}>
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
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                    opacity: ripple1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
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
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                    opacity: ripple2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0],
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
                        scale: ripple3.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                    opacity: ripple3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 0],
                    }),
                  },
                ]}
              />
            </>
          )}

          {/* Main Record Button - matching the design in the image */}
          <Animated.View
            style={[
              styles.recordButton,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: isRecording ? "#FF3B30" : "#007AFF",
              },
            ]}
          >
            <Pressable
              style={styles.recordButtonPressable}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
            >
              <View style={styles.recordButtonInner}>
                {isLoading ? (
                  <Ionicons name="hourglass" size={40} color="white" />
                ) : isRecording ? (
                  <Ionicons name="stop" size={40} color="white" />
                ) : (
                  <Ionicons name="mic" size={40} color="white" />
                )}
              </View>
            </Pressable>
          </Animated.View>
        </View>

        {/* Status text below the button */}
        <View style={styles.statusContainer}>
          <ThemedText style={styles.statusText}>
            {isLoading
              ? "Processing..."
              : isRecording
              ? `Recording ${formatDuration(recordingDuration)}`
              : "Tap to record"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  recordingContainer: {
    alignItems: "center",
    gap: 20,
  },
  animationContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 8,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  recordButtonPressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
  recordButtonInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    textAlign: "center",
  },
});
