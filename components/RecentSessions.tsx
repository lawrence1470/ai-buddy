import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function RecentSessions() {
  return (
    <View style={styles.recentSection}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Recent Sessions</ThemedText>
        <ThemedText style={styles.seeAll}>See All</ThemedText>
      </View>

      <View style={styles.recentItems}>
        <View style={styles.recentItem}>
          <View style={[styles.recentIcon, { backgroundColor: "#E6E6FA" }]}>
            <ThemedText style={styles.recentIconText}>💬</ThemedText>
          </View>
          <ThemedText style={styles.recentText} numberOfLines={2}>
            What is artificial intelligence?
          </ThemedText>
          <ThemedText style={styles.moreIcon}>⋯</ThemedText>
        </View>

        <View style={styles.recentItem}>
          <View style={[styles.recentIcon, { backgroundColor: "#2C2C2E" }]}>
            <ThemedText style={styles.recentIconText}>🎵</ThemedText>
          </View>
          <ThemedText style={styles.recentText} numberOfLines={2}>
            Voice recognition demo
          </ThemedText>
          <ThemedText style={styles.moreIcon}>⋯</ThemedText>
        </View>

        <View style={styles.recentItem}>
          <View style={[styles.recentIcon, { backgroundColor: "#FFE4B5" }]}>
            <ThemedText style={styles.recentIconText}>📝</ThemedText>
          </View>
          <ThemedText style={styles.recentText} numberOfLines={2}>
            Transcription analysis
          </ThemedText>
          <ThemedText style={styles.moreIcon}>⋯</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recentSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  seeAll: {
    fontSize: 15,
    color: "#007AFF",
  },
  recentItems: {
    gap: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 60,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  recentIconText: {
    fontSize: 16,
  },
  recentText: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
    lineHeight: 20,
  },
  moreIcon: {
    fontSize: 15,
    color: "#8E8E93",
    flexShrink: 0,
  },
});
