import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { queryClient } from "@/lib/queryClient";
import { tokenCache } from "@/lib/tokenCache";
import { ClerkProvider } from "@clerk/clerk-expo";
import { QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <QueryClientProvider client={queryClient}>
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
              <Stack.Screen
                name="ai-buddy-selection"
                options={{
                  headerShown: false,
                  gestureEnabled: true,
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="profile-setup"
                options={{
                  headerShown: false,
                  gestureEnabled: true,
                  animation: "slide_from_bottom",
                }}
              />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
