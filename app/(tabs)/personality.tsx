import Orb from "@/components/Orb";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";
import {
  PersonalityProfile,
  personalityService,
} from "@/services/personalityService";
import { LinearGradient } from "expo-linear-gradient";
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

  const [personality, setPersonality] = useState<PersonalityProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    getCurrentUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          setIsAuthenticated(true);
        } else {
          setUserId(null);
          setIsAuthenticated(false);
          setPersonality(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (userId && isAuthenticated) {
      fetchPersonalityData();
    }
  }, [userId, isAuthenticated]);

  const getCurrentUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error getting current user:", error);
      setLoading(false);
      setIsAuthenticated(false);
    }
  };

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
          <ThemedText style={styles.traitValue}>{percentage}%</ThemedText>
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
                backgroundColor: "#667EEA",
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
          <ThemedText style={styles.mbtiType}>
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

  const renderEmptyState = () => (
    <ThemedView
      style={[styles.card, { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" }]}
    >
      <View style={styles.emptyStateContainer}>
        <ThemedText style={styles.emptyStateTitle}>
          No Personality Data Yet
        </ThemedText>
        <ThemedText style={styles.emptyStateMessage}>
          Start chatting with your AI buddy to build your personality profile!
        </ThemedText>
        <ThemedText style={styles.emptyStateSubmessage}>
          Your conversations will be analyzed to understand your communication
          patterns and personality traits.
        </ThemedText>
      </View>
    </ThemedView>
  );

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

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#F8F6F0" },
      ]}
    >
      <LinearGradient
        colors={isDark ? ["#000000", "#1a1a1a"] : ["#F8F6F0", "#E8E6E0"]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
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
            renderEmptyState()
          )}

          {personality?.last_updated && (
            <ThemedText style={styles.lastUpdated}>
              Last updated:{" "}
              {new Date(personality.last_updated).toLocaleDateString()}
            </ThemedText>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
    color: "#667EEA",
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
    color: "#667EEA",
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
});
