import AIBuddyCard from "@/components/AIBuddyCard";
import { ThemedText } from "@/components/ThemedText";
import { useAIBuddies } from "@/hooks/useAIBuddies";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelectBuddy } from "@/hooks/useSelectBuddy";
import { AIBuddy } from "@/services/aiBuddyService";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

export default function AIBuddySelectionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedBuddy, setSelectedBuddy] = useState<AIBuddy | null>(null);
  const { user } = useUser();

  const { data: buddies, isLoading, error } = useAIBuddies();
  const selectBuddyMutation = useSelectBuddy();

  const handleGoBack = () => {
    router.back();
  };

  const handleSelectBuddy = (buddy: AIBuddy) => {
    setSelectedBuddy(buddy);
  };

  const handleConfirmSelection = async () => {
    if (selectedBuddy && user?.id) {
      try {
        // Validate buddy ID is not empty
        if (!selectedBuddy.id) {
          throw new Error("Buddy ID is missing");
        }

        // Use TanStack Query mutation to select the buddy
        await selectBuddyMutation.mutateAsync(selectedBuddy.id);

        console.log("Selected buddy saved to backend:", selectedBuddy.name);

        // Navigate back to home screen
        router.push("/");
      } catch (error) {
        console.error("Error saving selected buddy:", error);

        // More detailed error message
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        Alert.alert(
          "Selection Failed",
          `Failed to save your AI buddy selection: ${errorMessage}\n\nPlease try again or contact support if the issue persists.`,
          [{ text: "OK" }]
        );
      }
    } else if (!user?.id) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to select an AI buddy.",
        [{ text: "OK" }]
      );
    }
  };

  const renderBuddyCard = ({ item }: { item: AIBuddy }) => (
    <AIBuddyCard
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
              Failed to load AI buddies. Please check your connection.
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
            style={[
              styles.confirmButton,
              { opacity: selectBuddyMutation.isPending ? 0.7 : 1 },
            ]}
            onPress={handleConfirmSelection}
            disabled={selectBuddyMutation.isPending}
          >
            {selectBuddyMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.confirmButtonText}>
                Start chatting with {selectedBuddy.name}
              </ThemedText>
            )}
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
