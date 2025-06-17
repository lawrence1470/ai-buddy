import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface RecentSessionsProps {
  onSeeAll?: () => void;
  onSessionPress?: (sessionId: string) => void;
}

export default function RecentSessions({
  onSeeAll,
  onSessionPress,
}: RecentSessionsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const recentSessions = [
    {
      id: "1",
      title: "How to improve my productivity?",
      icon: "💬",
      backgroundColor: "#667EEA",
    },
    {
      id: "2",
      title: "What are the latest AI trends?",
      icon: "🤖",
      backgroundColor: "#667EEA",
    },
    {
      id: "3",
      title: "Help me plan my weekly schedule",
      icon: "📅",
      backgroundColor: "#667EEA",
    },
  ];

  return (
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
        <Pressable onPress={onSeeAll}>
          <ThemedText style={styles.seeAllText}>See All</ThemedText>
        </Pressable>
      </View>

      <View style={styles.recentList}>
        {recentSessions.map((session) => (
          <Pressable
            key={session.id}
            style={styles.recentItem}
            onPress={() => onSessionPress?.(session.id)}
          >
            <View
              style={[
                styles.recentAvatar,
                { backgroundColor: session.backgroundColor },
              ]}
            >
              <ThemedText style={styles.recentAvatarText}>
                {session.icon}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.recentText,
                { color: isDark ? "#FFFFFF" : "#1C1C1E" },
              ]}
              numberOfLines={1}
            >
              {session.title}
            </ThemedText>
            <ThemedText style={styles.recentMenu}>⋯</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    fontSize: 16,
    color: "#667EEA",
  },
  recentList: {
    gap: 0,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  recentAvatarText: {
    fontSize: 16,
  },
  recentText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    marginRight: 8,
  },
  recentMenu: {
    fontSize: 20,
    color: "#8E8E93",
    flexShrink: 0,
  },
});
