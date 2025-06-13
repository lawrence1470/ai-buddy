import Orb from "@/components/Orb";
import { ThemedText } from "@/components/ThemedText";
import { useAISpeaking } from "@/hooks/useAISpeaking";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
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

  const isDark = colorScheme === "dark";

  const handleNewChat = () => {
    router.push("/new-chat");
  };

  const handleTalkWithAI = () => {
    router.push("/new-chat");
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
                  Hello there
                </ThemedText>
                <ThemedText
                  style={[
                    styles.subtitle,
                    { color: isDark ? "#8E8E93" : "#8E8E93" },
                  ]}
                >
                  Make your day easy with AI
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionCards}>
          <Pressable
            style={[styles.card, styles.newChatCard]}
            onPress={handleNewChat}
          >
            <View style={styles.cardContent}>
              <ThemedText style={styles.cardIcon}>✏️</ThemedText>
              <View style={styles.newBadge}>
                <ThemedText style={styles.newBadgeText}>New</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.cardTitle}>New chat</ThemedText>
          </Pressable>

          <Pressable
            style={[styles.card, styles.talkCard]}
            onPress={handleTalkWithAI}
          >
            <ThemedText style={styles.cardTitle}>Talk with AI Buddy</ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              Let&apos;s try it now
            </ThemedText>
          </Pressable>
        </View>

        {/* Search by Voice */}
        <Pressable style={styles.searchCard}>
          <View style={styles.searchContent}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <ThemedText style={styles.searchText}>Search by voice</ThemedText>
          </View>
        </Pressable>

        {/* Recent Sessions */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <ThemedText
              style={[
                styles.recentTitle,
                { color: isDark ? "#FFFFFF" : "#1C1C1E" },
              ]}
            >
              Recent Sessions
            </ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
            </Pressable>
          </View>

          <View style={styles.recentList}>
            <Pressable style={styles.recentItem}>
              <View style={styles.recentAvatar}>
                <ThemedText style={styles.recentAvatarText}>💬</ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.recentItemText,
                  { color: isDark ? "#FFFFFF" : "#1C1C1E" },
                ]}
              >
                What is artificial intelligence?
              </ThemedText>
              <ThemedText style={styles.recentMenu}>⋯</ThemedText>
            </Pressable>

            <Pressable style={styles.recentItem}>
              <View
                style={[styles.recentAvatar, { backgroundColor: "#2C2C2E" }]}
              >
                <ThemedText style={styles.recentAvatarText}>🎤</ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.recentItemText,
                  { color: isDark ? "#FFFFFF" : "#1C1C1E" },
                ]}
              >
                Voice recognition demo
              </ThemedText>
              <ThemedText style={styles.recentMenu}>⋯</ThemedText>
            </Pressable>

            <Pressable style={styles.recentItem}>
              <View
                style={[styles.recentAvatar, { backgroundColor: "#F4E1A1" }]}
              >
                <ThemedText style={styles.recentAvatarText}>📝</ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.recentItemText,
                  { color: isDark ? "#FFFFFF" : "#1C1C1E" },
                ]}
              >
                Transcription analysis
              </ThemedText>
              <ThemedText style={styles.recentMenu}>⋯</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
    marginRight: 15,
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
  actionCards: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
  },
  newChatCard: {
    backgroundColor: "#F4E1A1",
  },
  talkCard: {
    backgroundColor: "#C8D5F7",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 24,
  },
  newBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  searchCard: {
    marginHorizontal: 20,
    backgroundColor: "#2C2C2E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#667EEA",
    fontSize: 16,
    fontWeight: "500",
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentAvatarText: {
    fontSize: 18,
  },
  recentItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  recentMenu: {
    fontSize: 20,
    color: "#8E8E93",
  },
});
