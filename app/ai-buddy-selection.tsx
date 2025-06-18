import { ThemedText } from "@/components/ThemedText";
import { useAIBuddies } from "@/hooks/useAIBuddies";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AIBuddy } from "@/services/aiBuddyService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

// Simple buddy card component inline to avoid linter issues
function BuddyCard({
  buddy,
  onPress,
  isSelected,
}: {
  buddy: AIBuddy;
  onPress: (buddy: AIBuddy) => void;
  isSelected: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      style={[
        styles.buddyCard,
        isSelected && styles.selectedCard,
        { backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF" },
      ]}
      onPress={() => onPress(buddy)}
    >
      <View style={styles.cardHeader}>
        <ThemedText style={styles.emoji}>
          {buddy.avatar?.emoji || "🤖"}
        </ThemedText>
        {isSelected && (
          <View style={styles.checkmark}>
            <ThemedText style={styles.checkmarkText}>✓</ThemedText>
          </View>
        )}
      </View>

      <ThemedText
        style={[styles.buddyName, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
      >
        {buddy.name}
      </ThemedText>

      <ThemedText
        style={[
          styles.buddyDescription,
          { color: isDark ? "#8E8E93" : "#666666" },
        ]}
      >
        {buddy.personality?.description}
      </ThemedText>

      {buddy.personality?.mbti_type && (
        <View style={styles.mbtiContainer}>
          <ThemedText style={styles.mbtiText}>
            {buddy.personality.mbti_type}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

export default function AIBuddySelectionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedBuddy, setSelectedBuddy] = useState<AIBuddy | null>(null);

  const { data: buddies, isLoading, error } = useAIBuddies();

  const handleGoBack = () => {
    router.back();
  };

  const handleSelectBuddy = (buddy: AIBuddy) => {
    setSelectedBuddy(buddy);
  };

  const handleConfirmSelection = () => {
    if (selectedBuddy) {
      // TODO: Save selected buddy to user preferences/context
      console.log("Selected buddy:", selectedBuddy);
      // Navigate to chat with selected buddy
      router.push("/new-chat");
    }
  };

  const renderBuddyCard = ({ item }: { item: AIBuddy }) => (
    <BuddyCard
      buddy={item}
      onPress={handleSelectBuddy}
      isSelected={selectedBuddy?.id === item.id}
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#F8F6F0" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#FFFFFF" : "#1C1C1E"}
          />
        </Pressable>
        <ThemedText
          style={[
            styles.headerTitle,
            { color: isDark ? "#FFFFFF" : "#1C1C1E" },
          ]}
        >
          Choose Your AI Buddy
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <ThemedText
          style={[styles.subtitle, { color: isDark ? "#8E8E93" : "#666666" }]}
        >
          Each AI buddy has a unique personality and voice
        </ThemedText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667EEA" />
            <ThemedText
              style={[
                styles.loadingText,
                { color: isDark ? "#8E8E93" : "#666666" },
              ]}
            >
              Loading AI Buddies...
            </ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <ThemedText
              style={[
                styles.errorText,
                { color: isDark ? "#FF6B6B" : "#DC2626" },
              ]}
            >
              Using demo buddies (API connection failed)
            </ThemedText>
          </View>
        ) : null}

        <FlatList
          data={buddies || []}
          renderItem={renderBuddyCard}
          keyExtractor={(item) => item.id || ""}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      {/* Confirm Button */}
      {selectedBuddy && (
        <View style={styles.confirmContainer}>
          <Pressable
            style={styles.confirmButton}
            onPress={handleConfirmSelection}
          >
            <ThemedText style={styles.confirmButtonText}>
              Start chatting with {selectedBuddy.name}
            </ThemedText>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 100,
  },
  buddyCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#667EEA",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  buddyName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  buddyDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  mbtiContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mbtiText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#667EEA",
  },
  confirmContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  confirmButton: {
    backgroundColor: "#667EEA",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
