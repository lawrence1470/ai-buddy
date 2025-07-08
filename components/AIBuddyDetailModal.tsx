import { useColorScheme } from "@/hooks/useColorScheme";
import { AIBuddy } from "@/services/aiBuddyService";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Orb from "./Orb";
import { Text, H3, H5 } from "./typography";
import { Ionicons } from "@expo/vector-icons";

interface AIBuddyDetailModalProps {
  buddy: AIBuddy | null;
  visible: boolean;
  onClose: () => void;
  onSelect?: (buddy: AIBuddy) => void;
}

export default function AIBuddyDetailModal({
  buddy,
  visible,
  onClose,
  onSelect,
}: AIBuddyDetailModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (!buddy) return null;

  const getGradientColors = (): [string, string] => {
    const colorSchema = (buddy as any).color_schema;
    if (colorSchema?.primary && colorSchema?.secondary) {
      return [colorSchema.primary, colorSchema.secondary];
    }
    return ["#667EEA", "#764BA2"];
  };

  const handleSelect = () => {
    onSelect?.(buddy);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
          {/* Glass background */}
          {Platform.OS === "ios" ? (
            <BlurView intensity={90} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill}>
              <View style={[styles.glassOverlay, isDark && styles.glassOverlayDark]} />
            </BlurView>
          ) : (
            <View style={[styles.androidGlass, isDark && styles.androidGlassDark]} />
          )}

          {/* Header */}
          <LinearGradient
            colors={getGradientColors()}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <Orb
                size={80}
                colors={getGradientColors()}
                color={getGradientColors()[0]}
                animated={true}
              />
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          </LinearGradient>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Name and personality type */}
            <View style={styles.titleSection}>
              <H3 lightColor="#1C1C1E" darkColor="#FFFFFF">
                {buddy.name}
              </H3>
              <View style={styles.badgeRow}>
                {buddy.personality?.mbti_type && (
                  <View style={[styles.badge, { backgroundColor: getGradientColors()[0] + "20" }]}>
                    <Text variant="overline" style={[styles.badgeText, { color: getGradientColors()[0] }]}>
                      {buddy.personality.mbti_type}
                    </Text>
                  </View>
                )}
                {buddy.voice?.accent && (
                  <View style={[styles.badge, { backgroundColor: getGradientColors()[1] + "20" }]}>
                    <Text variant="overline" style={[styles.badgeText, { color: getGradientColors()[1] }]}>
                      {buddy.voice.accent} Accent
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <H5 lightColor="#666666" darkColor="#A0A0A0" style={styles.sectionTitle}>
                About
              </H5>
              <Text variant="body" lightColor="#1C1C1E" darkColor="#FFFFFF">
                {buddy.personality?.description}
              </Text>
            </View>

            {/* Traits */}
            {buddy.personality?.traits && buddy.personality.traits.length > 0 && (
              <View style={styles.section}>
                <H5 lightColor="#666666" darkColor="#A0A0A0" style={styles.sectionTitle}>
                  Personality Traits
                </H5>
                <View style={styles.traitsGrid}>
                  {buddy.personality.traits.map((trait, index) => (
                    <View
                      key={index}
                      style={[
                        styles.traitChip,
                        { 
                          backgroundColor: isDark 
                            ? "rgba(255, 255, 255, 0.1)" 
                            : "rgba(0, 0, 0, 0.05)" 
                        }
                      ]}
                    >
                      <Text variant="caption" lightColor="#666666" darkColor="#A0A0A0">
                        {trait}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Sample responses */}
            {buddy.sample_responses && buddy.sample_responses.length > 0 && (
              <View style={styles.section}>
                <H5 lightColor="#666666" darkColor="#A0A0A0" style={styles.sectionTitle}>
                  How {buddy.name} Talks
                </H5>
                <View style={styles.quotesContainer}>
                  {buddy.sample_responses.slice(0, 2).map((response, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.quote,
                        { 
                          backgroundColor: isDark 
                            ? "rgba(255, 255, 255, 0.05)" 
                            : "rgba(0, 0, 0, 0.02)",
                          borderLeftColor: getGradientColors()[index % 2]
                        }
                      ]}
                    >
                      <Text variant="bodySmall" lightColor="#666666" darkColor="#A0A0A0" style={styles.quoteText}>
                        &ldquo;{response}&rdquo;
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Voice Details */}
            {buddy.voice && (
              <View style={styles.section}>
                <H5 lightColor="#666666" darkColor="#A0A0A0" style={styles.sectionTitle}>
                  Voice Profile
                </H5>
                <View style={styles.voiceDetails}>
                  {buddy.voice.accent && (
                    <View style={styles.voiceItem}>
                      <Ionicons 
                        name="globe-outline" 
                        size={16} 
                        color={isDark ? "#666" : "#999"} 
                      />
                      <Text variant="bodySmall" lightColor="#666666" darkColor="#A0A0A0" style={styles.voiceText}>
                        {buddy.voice.accent} accent
                      </Text>
                    </View>
                  )}
                  {buddy.voice.age && (
                    <View style={styles.voiceItem}>
                      <Ionicons 
                        name="person-outline" 
                        size={16} 
                        color={isDark ? "#666" : "#999"} 
                      />
                      <Text variant="bodySmall" lightColor="#666666" darkColor="#A0A0A0" style={styles.voiceText}>
                        {buddy.voice.age} voice
                      </Text>
                    </View>
                  )}
                  {buddy.voice.gender && (
                    <View style={styles.voiceItem}>
                      <Ionicons 
                        name="mic-outline" 
                        size={16} 
                        color={isDark ? "#666" : "#999"} 
                      />
                      <Text variant="bodySmall" lightColor="#666666" darkColor="#A0A0A0" style={styles.voiceText}>
                        {buddy.voice.gender} voice
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action button */}
          <View style={styles.footer}>
            <Pressable
              style={[styles.selectButton, { backgroundColor: getGradientColors()[0] }]}
              onPress={handleSelect}
            >
              <Text variant="button" color="#FFFFFF">
                Select {buddy.name}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  modalContentDark: {
    backgroundColor: "rgba(28, 28, 30, 0.95)",
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  glassOverlayDark: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  androidGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
  },
  androidGlassDark: {
    backgroundColor: "rgba(28, 28, 30, 0.97)",
  },
  header: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  traitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  traitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quotesContainer: {
    gap: 12,
  },
  quote: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
  },
  quoteText: {
    fontStyle: "italic",
    lineHeight: 20,
  },
  voiceDetails: {
    gap: 12,
  },
  voiceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  voiceText: {
    flex: 1,
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
  selectButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});