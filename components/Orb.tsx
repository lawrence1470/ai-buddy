import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface OrbProps {
  size?: number;
  color?: string;
  colors?: string[]; // For gradient support from AI buddy color_scheme
  animated?: boolean;
  isSpeaking?: boolean;
}

// Fallback to a native animated orb if WebGL fails
export default function Orb({
  size = 200,
  color = "#667EEA",
  colors,
  animated = true,
  isSpeaking = false,
}: OrbProps) {
  // Debug: Log what colors the Orb component is actually receiving
  console.log("🔴 Orb Component Debug:", {
    receivedColor: color,
    receivedColors: colors,
    size,
    isSpeaking,
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  // Speaking-specific animations
  const speakingScaleAnim = useRef(new Animated.Value(1)).current;
  const speakingGlowAnim = useRef(new Animated.Value(0)).current;
  const wave1Anim = useRef(new Animated.Value(1)).current;
  const wave2Anim = useRef(new Animated.Value(1)).current;
  const wave3Anim = useRef(new Animated.Value(1)).current;

  // Determine colors to use
  const orbColors = colors && colors.length >= 2 ? colors : [color, color];
  const primaryColor = colors && colors.length > 0 ? colors[0] : color;

  // Debug: Log the final computed colors
  console.log("🔴 Orb Final Colors:", {
    primaryColor,
    orbColors,
    usingGradient: colors && colors.length >= 2,
  });

  useEffect(() => {
    if (!animated) return;

    // Stop existing animations
    scaleAnim.stopAnimation();
    rotateAnim.stopAnimation();
    opacityAnim.stopAnimation();
    speakingScaleAnim.stopAnimation();
    speakingGlowAnim.stopAnimation();
    wave1Anim.stopAnimation();
    wave2Anim.stopAnimation();
    wave3Anim.stopAnimation();

    if (isSpeaking) {
      // Speaking animations - faster and more dynamic
      const speakingPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(speakingScaleAnim, {
            toValue: 1.15,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(speakingScaleAnim, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      const speakingGlow = Animated.loop(
        Animated.sequence([
          Animated.timing(speakingGlowAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(speakingGlowAnim, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );

      // Wave animations for speaking effect
      const waveAnimation1 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave1Anim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(wave1Anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );

      const waveAnimation2 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave2Anim, {
            toValue: 1.3,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(wave2Anim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );

      const waveAnimation3 = Animated.loop(
        Animated.sequence([
          Animated.timing(wave3Anim, {
            toValue: 1.4,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(wave3Anim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      );

      // Fast rotation for speaking
      const speakingRotation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );

      speakingPulse.start();
      speakingGlow.start();
      waveAnimation1.start();
      waveAnimation2.start();
      waveAnimation3.start();
      speakingRotation.start();
    } else {
      // Default idle animations - slower and more subtle
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      );

      const opacityAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.9,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      rotateAnimation.start();
      opacityAnimation.start();
    }
  }, [
    animated,
    isSpeaking,
    scaleAnim,
    rotateAnim,
    opacityAnim,
    speakingScaleAnim,
    speakingGlowAnim,
    wave1Anim,
    wave2Anim,
    wave3Anim,
  ]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const currentScale = isSpeaking ? speakingScaleAnim : scaleAnim;
  const currentOpacity = isSpeaking ? 0.9 : opacityAnim;

  const OrbContent = ({ children }: { children: React.ReactNode }) => {
    console.log("🔴 OrbContent rendering with:", {
      colors,
      orbColors,
      primaryColor,
    });

    // Use solid color instead of gradient to avoid rendering issues
    return (
      <View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            backgroundColor: primaryColor, // Use the actual backend color
            shadowColor: isSpeaking ? primaryColor : primaryColor,
            shadowRadius: isSpeaking ? 30 : 20,
            shadowOpacity: isSpeaking ? 0.8 : 0.6,
          },
        ]}
      >
        {children}
      </View>
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Speaking wave effects */}
      {isSpeaking && (
        <>
          <Animated.View
            style={[
              styles.speakingWave,
              {
                width: size * 1.2,
                height: size * 1.2,
                borderRadius: size * 0.6,
                borderColor: primaryColor,
                transform: [{ scale: wave1Anim }],
                opacity: speakingGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.3],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.speakingWave,
              {
                width: size * 1.4,
                height: size * 1.4,
                borderRadius: size * 0.7,
                borderColor: primaryColor,
                transform: [{ scale: wave2Anim }],
                opacity: speakingGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.05, 0.2],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.speakingWave,
              {
                width: size * 1.6,
                height: size * 1.6,
                borderRadius: size * 0.8,
                borderColor: primaryColor,
                transform: [{ scale: wave3Anim }],
                opacity: speakingGlowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.02, 0.1],
                }),
              },
            ]}
          />
        </>
      )}

      <Animated.View
        style={{
          transform: [{ scale: currentScale }, { rotate: spin }],
          opacity: currentOpacity,
        }}
      >
        <OrbContent>
          {/* Inner glow effect */}
          <View style={[styles.innerGlow, { backgroundColor: primaryColor }]} />

          {/* Outer glow effect */}
          <View style={[styles.outerGlow, { backgroundColor: primaryColor }]} />

          {/* Highlight */}
          <View style={styles.highlight} />

          {/* Speaking indicator */}
          {isSpeaking && (
            <Animated.View
              style={[
                styles.speakingIndicator,
                {
                  backgroundColor: primaryColor,
                  opacity: speakingGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.8],
                  }),
                },
              ]}
            />
          )}
        </OrbContent>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  orb: {
    borderRadius: 1000,
    position: "relative",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 10,
  },
  innerGlow: {
    position: "absolute",
    top: "20%",
    left: "20%",
    width: "60%",
    height: "60%",
    borderRadius: 1000,
    opacity: 0.3,
  },
  outerGlow: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "120%",
    height: "120%",
    borderRadius: 1000,
    opacity: 0.1,
  },
  highlight: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "20%",
    height: "20%",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  speakingWave: {
    position: "absolute",
    borderWidth: 2,
  },
  speakingIndicator: {
    position: "absolute",
    top: "35%",
    left: "35%",
    width: "30%",
    height: "30%",
    borderRadius: 1000,
  },
});
