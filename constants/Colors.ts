/**
 * Deep blue gradient-inspired color palette
 * Modern aesthetic matching the provided design
 * Primary: Deep blues with gradient effects
 * Accent: Soft pink/purple for playful elements
 */

// Gradient colors matching the design - lighter palette
const lightBlue = "#E8F4FF";
const paleBlue = "#F0F7FF";
const softWhite = "#F8FBFF";
const accentPink = "#FFB4D2";
const softPink = "#FDB4E2";
const mediumBlue = "#7DA3E0";

export const Colors = {
  light: {
    text: "#1A1A2E",
    background: "#FFFFFF",
    tint: mediumBlue,
    icon: "#4A5568",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: mediumBlue,
    // Light theme colors
    surface: "#FFFFFF",
    border: "rgba(0, 0, 0, 0.08)",
    borderStrong: "rgba(0, 0, 0, 0.12)",
    textSecondary: "#4A5568",
    textTertiary: "#718096",
    accent: accentPink,
    accentDim: softPink,
    accentSubtle: paleBlue,
    glass: "rgba(255, 255, 255, 0.95)",
    glassBorder: "rgba(0, 0, 0, 0.05)",
    // Gradient colors (for accents only)
    gradientStart: mediumBlue,
    gradientMid: paleBlue,
    gradientEnd: lightBlue,
    gradientPink: accentPink,
    cardBackground: "#FFFFFF",
    cardShadow: "rgba(0, 0, 0, 0.08)",
  },
  dark: {
    text: "#F9FAFB",
    background: "#1F2937",
    tint: mediumBlue,
    icon: "#E2E8F0",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: mediumBlue,
    // Dark mode with subtle gradients
    surface: "rgba(31, 41, 55, 0.95)",
    border: "rgba(255, 255, 255, 0.1)",
    borderStrong: "rgba(255, 255, 255, 0.15)",
    textSecondary: "#CBD5E0",
    textTertiary: "#A0AEC0",
    accent: accentPink,
    accentDim: softPink,
    accentSubtle: "#374151",
    glass: "rgba(31, 41, 55, 0.9)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
    // Gradient colors
    gradientStart: "#374151",
    gradientMid: "#4B5563",
    gradientEnd: "#6B7280",
    gradientPink: accentPink,
    cardBackground: "rgba(31, 41, 55, 0.95)",
    cardShadow: "rgba(0, 0, 0, 0.3)",
  },
};
