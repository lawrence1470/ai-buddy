import Loading from "@/components/Loading";
import Orb from "@/components/Orb";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSessions } from "@/hooks/useSessions";
import {
  PersonalityProfile,
  personalityService,
} from "@/services/personalityService";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PersonalityScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { user } = useUser();
  const { sessions } = useSessions();
  const [personality, setPersonality] = useState<PersonalityProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isAuthenticated = !!user;
  const userId = user?.id;

  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchPersonalityData();
    } else {
      setLoading(false);
    }
  }, [userId, isAuthenticated]);

  const fetchPersonalityData = async () => {
    if (!userId) return;

    try {
      const data = await personalityService.getPersonalityProfile(userId);
      setPersonality(data);
    } catch (error) {
      console.error("Error fetching personality data:", error);
      Alert.alert(
        "Error",
        "Failed to load personality data. Please try again later."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPersonalityData();
  };

  const renderTraitBar = (label: string, value: number) => {
    const percentage = Math.round(value * 100);
    const barWidth = value * (width - 80);

    return (
      <View key={label} style={styles.traitContainer}>
        <View style={styles.traitHeader}>
          <ThemedText style={styles.traitLabel}>
            {personalityService.getTraitLabel(label)}
          </ThemedText>
          <ThemedText style={[styles.traitValue, { color: Colors[colorScheme ?? "light"].tint }]}>{percentage}%</ThemedText>
        </View>
        <View
          style={[
            styles.traitBarBackground,
            { backgroundColor: isDark ? "#333" : "#E5E5E5" },
          ]}
        >
          <View
            style={[
              styles.traitBarFill,
              {
                width: barWidth,
                backgroundColor: Colors[colorScheme ?? "light"].gradientStart,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderPersonalityCard = () => {
    if (!personality) return null;

    return (
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
        ]}
      >
        <View style={styles.cardHeader}>
          <ThemedText style={[styles.mbtiType, { color: Colors[colorScheme ?? "light"].tint }]}>
            {personality.mbti_type}
          </ThemedText>
          <ThemedText style={styles.confidenceScore}>
            {Math.round((personality.confidence_score || 0) * 100)}% confident
          </ThemedText>
        </View>

        <ThemedText style={styles.typeDescription}>
          {personality.type_description ||
            personalityService.getMBTIDescription(personality.mbti_type || "")}
        </ThemedText>

        {personality.sessions_analyzed && (
          <ThemedText style={styles.sessionsAnalyzed}>
            Based on {personality.sessions_analyzed} conversation sessions
          </ThemedText>
        )}
      </ThemedView>
    );
  };

  const renderTraitScores = () => {
    if (!personality?.trait_scores) return null;

    return (
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
        ]}
      >
        <ThemedText style={styles.cardTitle}>Personality Traits</ThemedText>
        <View style={styles.traitsContainer}>
          {Object.entries(personality.trait_scores).map(([trait, score]) =>
            renderTraitBar(trait, score)
          )}
        </View>
      </ThemedView>
    );
  };

  const renderConversationInsights = () => {
    if (!personality?.conversation_insights) return null;

    return (
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
        ]}
      >
        <ThemedText style={styles.cardTitle}>Conversation Insights</ThemedText>
        <View style={styles.insightsContainer}>
          {Object.entries(personality.conversation_insights).map(
            ([key, value]) => (
              <View key={key} style={styles.insightItem}>
                <ThemedText style={styles.insightLabel}>
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  :
                </ThemedText>
                <ThemedText style={styles.insightValue}>
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </ThemedText>
              </View>
            )
          )}
        </View>
      </ThemedView>
    );
  };

  const renderDataCollectionState = () => {
    const sessionCount = sessions.length;
    const minSessionsNeeded = 5;
    const progressPercentage = Math.min(
      (sessionCount / minSessionsNeeded) * 100,
      100
    );

    return (
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
        ]}
      >
        <View style={styles.dataCollectionContainer}>
          <View style={styles.progressHeader}>
            <ThemedText style={styles.dataCollectionTitle}>
              Building Your Personality Profile
            </ThemedText>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: isDark ? "#333" : "#E5E5E5" },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: Colors[colorScheme ?? "light"].gradientStart,
                    },
                  ]}
                />
              </View>
              <ThemedText style={styles.progressText}>
                {sessionCount}/{minSessionsNeeded} conversations
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.dataCollectionMessage}>
            {sessionCount === 0
              ? "Start your first conversation to begin building your personality profile!"
              : sessionCount < minSessionsNeeded
              ? `Keep chatting! We need ${
                  minSessionsNeeded - sessionCount
                } more conversations to create your detailed personality insights.`
              : "We have enough data to analyze your personality patterns. Your insights will appear here soon!"}
          </ThemedText>

          <View style={styles.learningPoints}>
            <ThemedText style={styles.learningTitle}>
              What we learn from your conversations:
            </ThemedText>
            <View style={styles.learningItem}>
              <ThemedText style={[styles.bulletPoint, { color: Colors[colorScheme ?? "light"].tint }]}>•</ThemedText>
              <ThemedText style={styles.learningText}>
                Communication style and preferences
              </ThemedText>
            </View>
            <View style={styles.learningItem}>
              <ThemedText style={[styles.bulletPoint, { color: Colors[colorScheme ?? "light"].tint }]}>•</ThemedText>
              <ThemedText style={styles.learningText}>
                Personality traits (introversion/extraversion, thinking/feeling)
              </ThemedText>
            </View>
            <View style={styles.learningItem}>
              <ThemedText style={[styles.bulletPoint, { color: Colors[colorScheme ?? "light"].tint }]}>•</ThemedText>
              <ThemedText style={styles.learningText}>
                Decision-making patterns and interests
              </ThemedText>
            </View>
            <View style={styles.learningItem}>
              <ThemedText style={[styles.bulletPoint, { color: Colors[colorScheme ?? "light"].tint }]}>•</ThemedText>
              <ThemedText style={styles.learningText}>
                Emotional expressions and conversation topics
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.privacyNote}>
            🔒 Your conversations are private and secure. We only analyze
            patterns to help understand your personality better.
          </ThemedText>
        </View>
      </ThemedView>
    );
  };

  const renderLoginRequired = () => (
    <ThemedView
      style={[styles.card, { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" }]}
    >
      <View style={styles.emptyStateContainer}>
        <ThemedText style={styles.emptyStateTitle}>Login Required</ThemedText>
        <ThemedText style={styles.emptyStateMessage}>
          Please log in to view your personality insights.
        </ThemedText>
        <ThemedText style={styles.emptyStateSubmessage}>
          Your personality profile is built from your private conversations and
          requires authentication to access.
        </ThemedText>
      </View>
    </ThemedView>
  );

  if (loading && !profile) {
    return <Loading message="Analyzing your personality..." />;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme ?? "light"].background },
      ]}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: Colors[colorScheme ?? "light"].background }]}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: Colors[colorScheme ?? "light"].background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Orb */}
        <View style={styles.header}>
          <Orb
            size={120}
            color="#667EEA"
            animated={true}
            isSpeaking={false}
          />
          <ThemedText style={styles.headerTitle}>Your Personality</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            AI-powered insights from your conversations
          </ThemedText>
        </View>

        {/* Content */}
        {loading ? (
          <ThemedView
            style={[
              styles.card,
              { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
            ]}
          >
            <ThemedText style={styles.loadingText}>
              Loading personality insights...
            </ThemedText>
          </ThemedView>
        ) : !isAuthenticated ? (
          renderLoginRequired()
        ) : personality ? (
          <>
            {renderPersonalityCard()}
            {renderTraitScores()}
            {renderConversationInsights()}
          </>
        ) : (
          renderDataCollectionState()
        )}

        {personality?.last_updated && (
          <ThemedText style={styles.lastUpdated}>
            Last updated:{" "}
            {new Date(personality.last_updated).toLocaleDateString()}
          </ThemedText>
        )}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 34,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    paddingTop: 8,
    lineHeight: 22,
    minHeight: 44,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mbtiType: {
    fontSize: 32,
    fontWeight: "bold",
    minHeight: 40,
    lineHeight: 38,
  },
  confidenceScore: {
    fontSize: 14,
    opacity: 0.7,
  },
  typeDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  sessionsAnalyzed: {
    fontSize: 14,
    opacity: 0.6,
    fontStyle: "italic",
  },
  traitsContainer: {
    gap: 16,
  },
  traitContainer: {
    marginBottom: 8,
  },
  traitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  traitLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  traitValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  traitBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  traitBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  insightsContainer: {
    gap: 12,
  },
  insightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  insightLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  insightValue: {
    fontSize: 14,
    opacity: 0.8,
    flex: 1,
    textAlign: "right",
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    opacity: 0.8,
  },
  emptyStateSubmessage: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    padding: 20,
  },
  lastUpdated: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.5,
    marginTop: 16,
  },
  // Data Collection State Styles
  dataCollectionContainer: {
    paddingVertical: 24,
  },
  progressHeader: {
    marginBottom: 20,
  },
  dataCollectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    fontWeight: "500",
  },
  dataCollectionMessage: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.8,
  },
  learningPoints: {
    marginBottom: 20,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  learningItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  learningText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    opacity: 0.8,
  },
  privacyNote: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.6,
    textAlign: "center",
    fontStyle: "italic",
  },
});
