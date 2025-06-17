import Orb from "@/components/Orb";
import PhoneAuthModal from "@/components/PhoneAuthModal";
import ProfileCompletionCard from "@/components/ProfileCompletionCard";
import RecentSessions from "@/components/RecentSessions";
import { ThemedText } from "@/components/ThemedText";
import { useAISpeaking } from "@/hooks/useAISpeaking";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import {
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

  const isDark = colorScheme === "dark";

  const handleNewChat = () => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }
    router.push("/new-chat");
  };

  const handleTalkWithAI = () => {
    if (!isSignedIn) {
      setShowAuthModal(true);
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

  const getGreeting = () => {
    if (!isSignedIn) return "Hello there";

    // Prefer Supabase profile name, fallback to Clerk firstName
    const name = userProfile?.name || user?.firstName;

    if (name) {
      return `Hello ${name}`;
    }

    return "Hello there";
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
                <Orb
                  size={60}
                  color="#667EEA"
                  animated={true}
                  isSpeaking={isSpeaking}
                />
              </View>
              <View style={styles.headerText}>
                <ThemedText
                  style={[
                    styles.greeting,
                    { color: isDark ? "#FFFFFF" : "#1C1C1E" },
                  ]}
                >
                  {getGreeting()}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.subtitle,
                    { color: isDark ? "#8E8E93" : "#8E8E93" },
                  ]}
                >
                  {isSignedIn
                    ? "Make your day easy with AI"
                    : "Sign in to get started"}
                </ThemedText>
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
              !isSignedIn && styles.cardDisabled,
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
          </Pressable>

          <Pressable
            style={[
              styles.card,
              styles.talkCard,
              !isSignedIn && styles.cardDisabled,
            ]}
            onPress={handleTalkWithAI}
          >
            <ThemedText style={styles.cardTitle}>Talk with AI Buddy</ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              {isSignedIn ? "Let's try it now" : "Sign in to start talking"}
            </ThemedText>
          </Pressable>
        </View>

        {/* Search by Voice */}
        <Pressable
          style={[styles.searchCard, !isSignedIn && styles.cardDisabled]}
          onPress={() => {
            if (!isSignedIn) {
              setShowAuthModal(true);
            }
          }}
        >
          <View style={styles.searchContent}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <ThemedText style={styles.searchText}>
              {isSignedIn ? "Search by voice" : "Sign in to search by voice"}
            </ThemedText>
          </View>
        </Pressable>

        {/* Recent Sessions - Only show if authenticated */}
        {isSignedIn && (
          <RecentSessions
            onSeeAll={handleSeeAllSessions}
            onSessionPress={handleSessionPress}
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
  searchCard: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
});
