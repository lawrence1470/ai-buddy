import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSessions } from "@/hooks/useSessions";
import React, { forwardRef, useImperativeHandle } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface RecentSessionsProps {
  onSeeAll?: () => void;
  onSessionPress?: (sessionId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
}

interface SessionRowProps {
  session: {
    id: string;
    title: string;
    icon: string;
    backgroundColor: string;
  };
  onPress: () => void;
  onDelete: () => void;
  onDeleteButtonPress: () => void;
  isDark: boolean;
}

interface SessionRowRef {
  resetSwipe: () => void;
}

const SessionRow = forwardRef<SessionRowRef, SessionRowProps>(
  ({ session, onPress, onDelete, onDeleteButtonPress, isDark }, ref) => {
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);
    const SWIPE_THRESHOLD = -60;
    const DELETE_BUTTON_WIDTH = 80;

    const resetSwipe = () => {
      translateX.value = withSpring(0);
      opacity.value = withSpring(1);
    };

    useImperativeHandle(ref, () => ({
      resetSwipe,
    }));

    const gestureHandler =
      useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart: () => {
          // Optional: Add haptic feedback here
        },
        onActive: (event) => {
          // Only allow left swipe (negative values)
          if (event.translationX < 0) {
            translateX.value = Math.max(
              event.translationX,
              -DELETE_BUTTON_WIDTH
            );
          }
        },
        onEnd: (event) => {
          const shouldShowDelete = event.translationX < SWIPE_THRESHOLD;

          if (shouldShowDelete) {
            // Snap to show delete button instead of moving off screen
            translateX.value = withSpring(-DELETE_BUTTON_WIDTH);
          } else {
            // Snap back to original position
            translateX.value = withSpring(0);
          }
        },
      });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
      };
    });

    const deleteButtonStyle = useAnimatedStyle(() => {
      const scale = translateX.value < -20 ? 1 : 0;
      return {
        transform: [{ scale: withSpring(scale) }],
        opacity: translateX.value < -20 ? 1 : 0,
      };
    });

    const handleDeletePress = () => {
      // Animate row off screen when delete button is pressed
      translateX.value = withTiming(-300, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(onDeleteButtonPress)();
      });
    };

    return (
      <View style={styles.sessionRowContainer}>
        <Animated.View
          style={[styles.deleteButtonContainer, deleteButtonStyle]}
        >
          <Pressable style={styles.deleteButton} onPress={handleDeletePress}>
            <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
          </Pressable>
        </Animated.View>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.sessionRowWrapper, animatedStyle]}>
            <Pressable style={styles.recentItem} onPress={onPress}>
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
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
);

SessionRow.displayName = "SessionRow";

export default function RecentSessions({
  onSeeAll,
  onSessionPress,
  onSessionDelete,
}: RecentSessionsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const sessionRefs = React.useRef<{ [key: string]: SessionRowRef | null }>({});

  // Use the real session data from the backend
  const { sessions, isLoading, error, deleteSession, refreshSessions } =
    useSessions();

  const handleSessionDelete = async (
    sessionId: string,
    sessionTitle: string
  ) => {
    Alert.alert(
      "Delete Session",
      `Are you sure you want to delete "${sessionTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            // Reset the swipe animation when user cancels
            sessionRefs.current[sessionId]?.resetSwipe();
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteSession(sessionId);
            if (success) {
              onSessionDelete?.(sessionId);
            } else {
              // Reset swipe if deletion failed
              sessionRefs.current[sessionId]?.resetSwipe();
            }
          },
        },
      ]
    );
  };

  const handleDirectDelete = async (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      await handleSessionDelete(sessionId, session.title);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText
            style={[styles.title, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
          >
            Recent Sessions
          </ThemedText>
          <Pressable onPress={onSeeAll}>
            <ThemedText style={styles.seeAll}>See All</ThemedText>
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={isDark ? "#FFFFFF" : "#1C1C1E"}
          />
          <ThemedText
            style={[
              styles.loadingText,
              { color: isDark ? "#FFFFFF" : "#1C1C1E" },
            ]}
          >
            Loading sessions...
          </ThemedText>
        </View>
      </View>
    );
  }

  // Show empty state if no sessions
  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText
            style={[styles.title, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
          >
            Recent Sessions
          </ThemedText>
          <Pressable onPress={onSeeAll}>
            <ThemedText style={styles.seeAll}>See All</ThemedText>
          </Pressable>
        </View>
        <View style={styles.emptyContainer}>
          <ThemedText
            style={[
              styles.emptyText,
              { color: isDark ? "#999999" : "#666666" },
            ]}
          >
            No recent sessions yet
          </ThemedText>
          <ThemedText
            style={[
              styles.emptySubtext,
              { color: isDark ? "#777777" : "#888888" },
            ]}
          >
            Start a conversation to see your history here
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          style={[styles.title, { color: isDark ? "#FFFFFF" : "#1C1C1E" }]}
        >
          Recent Sessions
        </ThemedText>
        <Pressable onPress={onSeeAll}>
          <ThemedText style={styles.seeAll}>See All</ThemedText>
        </Pressable>
      </View>

      <View style={styles.recentsContainer}>
        {sessions.slice(0, 3).map((session) => (
          <SessionRow
            key={session.id}
            ref={(ref) => {
              sessionRefs.current[session.id] = ref;
            }}
            session={session}
            onPress={() => onSessionPress?.(session.id)}
            onDelete={() => handleSessionDelete(session.id, session.title)}
            onDeleteButtonPress={() => handleDirectDelete(session.id)}
            isDark={isDark}
          />
        ))}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Pressable onPress={refreshSessions} style={styles.retryButton}>
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 16,
    color: "#667EEA",
  },
  recentsContainer: {
    gap: 0,
  },
  sessionRowContainer: {
    position: "relative",
    overflow: "hidden",
  },
  sessionRowWrapper: {
    backgroundColor: "transparent",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
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
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 40,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888888",
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  errorText: {
    color: "#FF3B30",
  },
  retryButton: {
    backgroundColor: "#667EEA",
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
