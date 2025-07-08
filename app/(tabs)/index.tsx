import Loading from "@/components/Loading";
import Orb from "@/components/Orb";
import PhoneAuthModal from "@/components/PhoneAuthModal";
import ProfileCompletionCard from "@/components/ProfileCompletionCard";
import RecentSessions from "@/components/RecentSessions";
import { ThemedText } from "@/components/ThemedText";
import { Text, H2 } from "@/components/typography";
import VoiceSearchCard from "@/components/VoiceSearchCard";
import { Colors } from "@/constants/Colors";
import { useAISpeaking } from "@/hooks/useAISpeaking";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelectedBuddy } from "@/hooks/useSelectedBuddy";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isSpeaking = useAISpeaking();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Debug: Log the actual background color being used
  useEffect(() => {
    console.log("=== Background Color Debug ===");
    console.log("Color scheme:", colorScheme);
    console.log("Background color:", Colors[colorScheme ?? "light"].background);
    console.log("Is this white?", Colors[colorScheme ?? "light"].background === "#FFFFFF");
    console.log("All light colors:", Colors.light);
    console.log("=============================");
  }, [colorScheme]);

  // Get user profile from Supabase
  const { data: userProfile } = useUserProfile();

  // Get user's selected buddy from backend
  const {
    data: selectedBuddy,
    isLoading: isLoadingBuddy,
    error: buddyError,
  } = useSelectedBuddy();

  // Debug: Log selected buddy color scheme
  useEffect(() => {
    console.log("=== Home Screen Buddy Debug ===");
    console.log("selectedBuddy:", selectedBuddy);
    console.log("isLoadingBuddy:", isLoadingBuddy);
    console.log("buddyError:", buddyError);

    if (selectedBuddy) {
      console.log("Buddy name:", selectedBuddy.name);
      console.log("Full buddy object:", JSON.stringify(selectedBuddy, null, 2));
      console.log("Avatar object:", selectedBuddy.avatar);
      console.log("Color schema object:", (selectedBuddy as any).color_schema);
      console.log(
        "Primary color:",
        (selectedBuddy as any).color_schema?.primary
      );
      console.log(
        "Secondary color:",
        (selectedBuddy as any).color_schema?.secondary
      );
      console.log("Old color scheme:", selectedBuddy.avatar?.color_scheme);
      console.log(
        "Old primary color:",
        selectedBuddy.avatar?.color_scheme?.[0]
      );
    } else {
      console.log("No selectedBuddy available");
    }
    console.log("==============================");
  }, [selectedBuddy, isLoadingBuddy, buddyError]);

  const isDark = colorScheme ?? "light" === "dark";

  // Check if user can start chatting (signed in AND has selected a buddy)
  const canStartChat =
    isSignedIn && selectedBuddy !== null && selectedBuddy !== undefined;
  const needsBuddySelection = isSignedIn && !selectedBuddy && !isLoadingBuddy;

  const handleNewChat = () => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedBuddy) {
      Alert.alert(
        "Select an AI Buddy First",
        "Please choose an AI buddy before starting a chat. Each buddy has a unique personality and voice!",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Choose Buddy",
            onPress: () => router.push("/ai-buddy-selection"),
          },
        ]
      );
      return;
    }

    router.push("/new-chat");
  };

  const handleTalkWithAI = () => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedBuddy) {
      Alert.alert(
        "Select an AI Buddy First",
        "Please choose an AI buddy before starting a conversation. Each buddy has a unique personality and voice!",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Choose Buddy",
            onPress: () => router.push("/ai-buddy-selection"),
          },
        ]
      );
      return;
    }

    router.push("/new-chat");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSeeAllSessions = () => {
    // TODO: Navigate to all sessions page
    console.log("Navigate to all sessions");
  };

  const handleSessionPress = (sessionId: string) => {
    // TODO: Navigate to specific session
    console.log("Navigate to session:", sessionId);
    router.push("/new-chat");
  };

  const handleSessionDelete = (sessionId: string) => {
    // TODO: Delete session from database/storage
    console.log("Delete session:", sessionId);
    // Add your session deletion logic here
  };

  const getGreeting = () => {
    if (!isSignedIn) return "Hello there";

    // Prefer Supabase profile name, fallback to Clerk firstName
    const name = userProfile?.name || user?.firstName;

    if (name) {
      return `Hello ${name}`;
    }

    return "Hello there";
  };

  const getSubtitle = () => {
    if (!isSignedIn) {
      return "Sign in to get started";
    }

    if (isLoadingBuddy) {
      return "Loading your AI buddy...";
    }

    if (buddyError) {
      return "Error loading buddy data";
    }

    if (needsBuddySelection) {
      return "Choose an AI buddy to start chatting";
    }

    if (selectedBuddy) {
      return `Ready to chat with ${selectedBuddy.name}`;
    }

    return "Make your day easy with AI";
  };

  // Show loading screen while fetching buddy data
  if (isLoadingBuddy && !selectedBuddy) {
    return <Loading message="Loading your AI buddy..." />;
  }

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background }
      ]}
    >
        <ScrollView
        style={[styles.scrollView, { backgroundColor: Colors[colorScheme ?? "light"].background }]}
        contentContainerStyle={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <View style={styles.avatarContainer}>
                {(() => {
                  // Use soft gradient colors for orbs
                  const orbColor = Colors[colorScheme ?? "light"].gradientPink;
                  const orbColors = [Colors[colorScheme ?? "light"].gradientStart, Colors[colorScheme ?? "light"].gradientEnd];

                  console.log("🎨 Orb Render Debug:", {
                    buddyName: selectedBuddy?.name,
                    buddyId: selectedBuddy?.id,
                    orbColor,
                    orbColors,
                    selectedBuddy: !!selectedBuddy,
                  });

                  return (
                    <Orb
                      size={60}
                      color={orbColor}
                      colors={orbColors}
                      animated={true}
                      isSpeaking={isSpeaking}
                    />
                  );
                })()}
              </View>
              <View style={styles.headerText}>
                <H2 style={{ color: Colors[colorScheme ?? "light"].text }}>
                  {getGreeting()}
                </H2>
                <Text
                  variant="bodySmall"
                  style={{ color: Colors[colorScheme ?? "light"].textSecondary }}
                >
                  {getSubtitle()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Completion Card - Only show for signed in users who need to complete profile */}
        {isSignedIn && <ProfileCompletionCard />}

        {/* Action Cards */}
        <View style={styles.actionCards}>
          <Pressable
            style={[
              styles.card,
              styles.newChatCard,
              !canStartChat && styles.cardDisabled,
              { backgroundColor: Colors[colorScheme ?? "light"].cardBackground }
            ]}
            onPress={handleNewChat}
          >
            <View style={styles.cardContent}>
              <ThemedText style={styles.cardIcon}>✏️</ThemedText>
              <View style={[styles.newBadge, { backgroundColor: Colors[colorScheme ?? "light"].accent }]}>
                <ThemedText style={[styles.newBadgeText, { color: "#FFFFFF" }]}>New</ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.cardTitle, { color: Colors[colorScheme ?? "light"].text }]}>
              New chat
            </ThemedText>
            {!isSignedIn && (
              <ThemedText style={[styles.cardDisabledText, { color: Colors[colorScheme ?? "light"].textTertiary }]}>
                Sign in required
              </ThemedText>
            )}
            {needsBuddySelection && (
              <ThemedText style={[styles.cardDisabledText, { color: Colors[colorScheme ?? "light"].textTertiary }]}>
                Choose an AI buddy first
              </ThemedText>
            )}
          </Pressable>

          <Pressable
            style={[
              styles.card,
              styles.talkCard,
              !canStartChat && styles.cardDisabled,
            ]}
            onPress={handleTalkWithAI}
          >
            <LinearGradient
              colors={isDark ? [Colors.dark.tint, Colors.dark.accentSubtle] : [Colors.light.tint, Colors.light.accentSubtle]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <ThemedText style={[styles.cardTitle, { color: "#FFFFFF" }]}>Talk with AI Buddy</ThemedText>
            <ThemedText style={[styles.cardSubtitle, { color: "rgba(255, 255, 255, 0.8)" }]}>
              {!isSignedIn
                ? "Sign in to start talking"
                : needsBuddySelection
                ? "Choose a buddy to start"
                : selectedBuddy
                ? `Ready to chat with ${selectedBuddy.name}!`
                : "Let's try it now"}
            </ThemedText>
          </Pressable>
        </View>

        {/* Choose AI Buddy */}
        <VoiceSearchCard
          isSignedIn={isSignedIn}
          disabled={!isSignedIn}
          onPress={() => {
            if (!isSignedIn) {
              setShowAuthModal(true);
            } else {
              router.push("/ai-buddy-selection");
            }
          }}
        />

        {/* Recent Sessions - Only show if authenticated */}
        {isSignedIn && (
          <RecentSessions
            onSeeAll={handleSeeAllSessions}
            onSessionPress={handleSessionPress}
            onSessionDelete={handleSessionDelete}
          />
        )}
      </ScrollView>

        {/* Auth Modal */}
        <PhoneAuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: Colors.light.background,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  // Authentication Button Styles
  authButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  signInButton: {},
  signOutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionCards: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
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
  cardDisabled: {
    opacity: 0.6,
  },
  cardDisabledText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
    fontWeight: "500",
  },
  newChatCard: {},
  talkCard: {
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
});
