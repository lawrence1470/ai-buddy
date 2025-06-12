import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Custom theme that matches our glassmorphism design
const GlassTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#667eea",
    background: "transparent",
    card: "rgba(255, 255, 255, 0.1)",
    text: "#ffffff",
    border: "rgba(255, 255, 255, 0.2)",
    notification: "#667eea",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={GlassTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="new-chat"
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
