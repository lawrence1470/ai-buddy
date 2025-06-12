import RecentSessions from "@/components/RecentSessions";
import { ThemedText } from "@/components/ThemedText";
import VoiceListener from "@/components/VoiceListener";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [transcription, setTranscription] = useState("");
  const [recordingUri, setRecordingUri] = useState("");
  const [hasActiveSession, setHasActiveSession] = useState(false);

  const handleRecordingComplete = (uri: string) => {
    setRecordingUri(uri);
    console.log("Recording saved to:", uri);
  };

  const handleTranscriptionReceived = (text: string) => {
    setTranscription(text);
  };

  const createNewSession = () => {
    router.push("/new-chat");
  };

  const endSession = () => {
    setHasActiveSession(false);
    setTranscription("");
    setRecordingUri("");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasActiveSession ? (
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.profileSection}>
                <View style={styles.profileIcon}>
                  <ThemedText style={styles.profileEmoji}>🤖</ThemedText>
                </View>
                <View>
                  <ThemedText style={styles.greeting}>Hello there</ThemedText>
                  <ThemedText style={styles.subtitle}>
                    Make your day easy with AI
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Main Cards Grid */}
            <View style={styles.cardsContainer}>
              <View style={styles.cardRow}>
                <Pressable
                  style={[styles.card, styles.voiceCard]}
                  onPress={createNewSession}
                >
                  <View style={styles.cardIcon}>
                    <ThemedText style={styles.cardIconText}>🎤</ThemedText>
                  </View>
                  <ThemedText style={styles.cardTitle}>New chat</ThemedText>
                  <View style={styles.newBadge}>
                    <ThemedText style={styles.newBadgeText}>New</ThemedText>
                  </View>
                </Pressable>

                <View style={[styles.card, styles.talkCard]}>
                  <ThemedText style={styles.talkTitle}>
                    Talk with AI Buddy
                  </ThemedText>
                  <ThemedText style={styles.talkSubtitle}>
                    Let&apos;s try it now
                  </ThemedText>
                </View>
              </View>

              <View style={styles.cardRow}>
                <View style={[styles.card, styles.searchCard]}>
                  <View style={styles.cardIcon}>
                    <ThemedText style={styles.cardIconText}>🔍</ThemedText>
                  </View>
                  <ThemedText style={styles.searchTitle}>
                    Search by voice
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Recent Activity */}
            <RecentSessions />
          </>
        ) : (
          <>
            {/* Active Session Header */}
            <View style={styles.sessionHeader}>
              <Pressable onPress={endSession} style={styles.backButton}>
                <ThemedText style={styles.backIcon}>←</ThemedText>
              </Pressable>
              <ThemedText style={styles.sessionTitle}>
                AI Buddy Session
              </ThemedText>
              <Pressable onPress={endSession} style={styles.endButton}>
                <ThemedText style={styles.endButtonText}>End</ThemedText>
              </Pressable>
            </View>

            {/* Chat Interface */}
            <View style={styles.chatContainer}>
              <View style={styles.chatBubble}>
                <ThemedText style={styles.chatText}>
                  Hi! I&apos;m ready to help you. Start by recording your voice
                  message.
                </ThemedText>
              </View>

              {transcription ? (
                <View style={styles.userBubble}>
                  <ThemedText style={styles.userText}>
                    {transcription}
                  </ThemedText>
                </View>
              ) : null}
            </View>

            {/* Voice Interface */}
            <View style={styles.voiceInterface}>
              <VoiceListener
                onRecordingComplete={handleRecordingComplete}
                onTranscriptionReceived={handleTranscriptionReceived}
              />

              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputPlaceholder}>
                  Ask anything here..
                </ThemedText>
                <Pressable style={styles.addButton}>
                  <ThemedText style={styles.addButtonText}>+</ThemedText>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 50,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#2C2C2E",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 22,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: "#8E8E93",
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    position: "relative",
  },
  voiceCard: {
    flex: 1,
    backgroundColor: "#FFE4B5",
    minHeight: 120,
    justifyContent: "space-between",
  },
  cardIcon: {
    marginBottom: 6,
  },
  cardIconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    flexWrap: "wrap",
  },
  newBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  newBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  talkCard: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    minHeight: 120,
    justifyContent: "center",
    paddingVertical: 16,
  },
  talkTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  talkSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    flexWrap: "wrap",
  },
  searchCard: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    minHeight: 120,
    justifyContent: "center",
  },
  searchTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    flexWrap: "wrap",
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#1C1C1E",
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  endButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FF3B30",
    borderRadius: 12,
  },
  endButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  chatContainer: {
    flex: 1,
    gap: 16,
    marginBottom: 24,
    minHeight: 200,
  },
  chatBubble: {
    backgroundColor: "#E6E6FA",
    padding: 16,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    alignSelf: "flex-start",
    maxWidth: "85%",
    minWidth: "60%",
  },
  chatText: {
    fontSize: 16,
    color: "#1C1C1E",
    lineHeight: 22,
    flexWrap: "wrap",
  },
  userBubble: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 20,
    borderTopRightRadius: 4,
    alignSelf: "flex-end",
    maxWidth: "85%",
    minWidth: "40%",
  },
  userText: {
    fontSize: 16,
    color: "white",
    lineHeight: 22,
    flexWrap: "wrap",
  },
  voiceInterface: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: "#8E8E93",
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: "#E6E6FA",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 18,
    color: "#1C1C1E",
  },
});
