import Orb from "@/components/Orb";
import PhoneAuthModal from "@/components/PhoneAuthModal";
import ProfileCompletionCard from "@/components/ProfileCompletionCard";
import RecentSessions from "@/components/RecentSessions";
import { ThemedText } from "@/components/ThemedText";
import { Text, H2 } from "@/components/typography";
import VoiceSearchCard from "@/components/VoiceSearchCard";
import { useAISpeaking } from "@/hooks/useAISpeaking";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelectedBuddy } from "@/hooks/useSelectedBuddy";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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

  const isDark = colorScheme === "dark";

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

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#F8F6F0" },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <View style={styles.avatarContainer}>
                {(() => {
                  // Use the correct field name from backend: color_schema instead of avatar.color_scheme
                  const colorSchema = (selectedBuddy as any)?.color_schema;
                  const orbColor = colorSchema?.primary || "#667EEA";
                  const orbColors = colorSchema
                    ? [colorSchema.primary, colorSchema.secondary]
                    : undefined;

                  console.log("🎨 Orb Render Debug:", {
                    buddyName: selectedBuddy?.name,
                    buddyId: selectedBuddy?.id,
                    colorSchema,
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
                <H2
                  lightColor="#1C1C1E"
                  darkColor="#FFFFFF"
                >
                  {getGreeting()}
                </H2>
                <Text
                  variant="bodySmall"
                  lightColor="#8E8E93"
                  darkColor="#8E8E93"
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
            ]}
            onPress={handleNewChat}
          >
            <View style={styles.cardContent}>
              <ThemedText style={styles.cardIcon}>✏️</ThemedText>
              <View style={styles.newBadge}>
                <ThemedText style={styles.newBadgeText}>New</ThemedText>
              </View>
            </View>
            <ThemedText style={[styles.cardTitle, { color: "#1C1C1E" }]}>
              New chat
            </ThemedText>
            {!isSignedIn && (
              <ThemedText style={styles.cardDisabledText}>
                Sign in required
              </ThemedText>
            )}
            {needsBuddySelection && (
              <ThemedText style={styles.cardDisabledText}>
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
            <ThemedText style={styles.cardTitle}>Talk with AI Buddy</ThemedText>
            <ThemedText style={styles.cardSubtitle}>
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
  signInButton: {
    backgroundColor: "#667EEA",
  },
  signOutButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#8E8E93",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  signOutButtonText: {
    color: "#8E8E93",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  cardDisabledText: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
    fontStyle: "italic",
    fontWeight: "500",
  },
  newChatCard: {
    backgroundColor: "#F8F6F0",
  },
  talkCard: {
    backgroundColor: "#667EEA",
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
    backgroundColor: "#667EEA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
});
