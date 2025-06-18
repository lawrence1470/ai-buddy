import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface VoiceSearchCardProps {
  onPress?: () => void;
  disabled?: boolean;
  isSignedIn?: boolean;
}

export default function VoiceSearchCard({
  onPress,
  disabled = false,
  isSignedIn = false,
}: VoiceSearchCardProps) {
  return (
    <Pressable
      style={[styles.searchCard, disabled && styles.cardDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.searchContent}>
        <ThemedText style={styles.searchIcon}>🤖</ThemedText>
        <ThemedText style={styles.searchText}>
          {isSignedIn ? "Choose an AI buddy" : "Sign in to choose an AI buddy"}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  cardDisabled: {
    opacity: 0.6,
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
