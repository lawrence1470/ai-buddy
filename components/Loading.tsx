import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { View as MView } from "moti";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "./typography";

const _size = 60;
const _border = Math.round(_size / 10);

interface LoadingProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export default function Loading({ 
  message, 
  size = _size, 
  fullScreen = true 
}: LoadingProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const borderSize = Math.round(size / 10);
  const colors = [
    Colors[colorScheme ?? "light"].gradientPink,
    Colors[colorScheme ?? "light"].accentDim,
    "#FFFFFF",
  ];

  const content = (
    <>
      <View style={styles.orbContainer}>
        <LinearGradient
          colors={colors}
          style={[styles.gradientBackground, { 
            width: size + 40, 
            height: size + 40,
            borderRadius: (size + 40) / 2,
          }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <MView
          from={{
            borderWidth: 0,
            width: size,
            height: size,
            opacity: 0,
            shadowOpacity: 0.5,
          }}
          animate={{
            borderWidth: borderSize,
            width: size + 12,
            height: size + 12,
            opacity: 1,
            shadowOpacity: 1,
          }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
          }}
          style={[
            styles.orb,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: borderSize,
              borderColor: isDark ? Colors.dark.surface : Colors.light.surface,
              shadowColor: Colors[colorScheme ?? "light"].gradientPink,
              backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
            }
          ]}
        />
      </View>
      {message && (
        <Text 
          variant="bodySmall" 
          lightColor={Colors.light.textSecondary}
          darkColor={Colors.dark.textSecondary}
          style={styles.message}
        >
          {message}
        </Text>
      )}
    </>
  );

  if (!fullScreen) {
    return <View style={styles.inlineContainer}>{content}</View>;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.dark.background : Colors.light.background },
      ]}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  orbContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBackground: {
    position: "absolute",
    opacity: 0.3,
  },
  orb: {
    shadowRadius: 20,
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 8,
  },
  message: {
    marginTop: 24,
    textAlign: "center",
  },
});