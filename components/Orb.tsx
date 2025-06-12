import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface OrbProps {
  size?: number;
  color?: string;
  animated?: boolean;
}

// Fallback to a native animated orb if WebGL fails
export default function Orb({
  size = 200,
  color = "#667EEA",
  animated = true,
}: OrbProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!animated) return;

    // Pulsing animation
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

    // Rotation animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    // Opacity breathing animation
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

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      opacityAnimation.stop();
    };
  }, [animated, scaleAnim, rotateAnim, opacityAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale: scaleAnim }, { rotate: spin }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Inner glow effect */}
        <View style={[styles.innerGlow, { backgroundColor: color }]} />

        {/* Outer glow effect */}
        <View style={[styles.outerGlow, { backgroundColor: color }]} />

        {/* Highlight */}
        <View style={styles.highlight} />
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
    shadowColor: "#667EEA",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
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
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
});
