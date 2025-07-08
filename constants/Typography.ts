/**
 * Typography system for AI Buddy app
 * Defines font families, sizes, weights, and spacing
 */

export const FontFamily = {
  outfit: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    semiBold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
  },
  jetbrainsMono: {
    regular: 'JetBrainsMono_400Regular',
    medium: 'JetBrainsMono_500Medium',
    bold: 'JetBrainsMono_700Bold',
  },
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
};

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
};

export const LineHeight = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 32,
  '2xl': 36,
  '3xl': 40,
  '4xl': 44,
  '5xl': 56,
  '6xl': 72,
};

export const FontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

export const Typography = {
  // Display styles
  display: {
    fontSize: FontSize['5xl'],
    lineHeight: LineHeight['5xl'],
    fontFamily: FontFamily.outfit.bold,
    fontWeight: FontWeight.bold,
  },
  
  // Heading styles
  h1: {
    fontSize: FontSize['4xl'],
    lineHeight: LineHeight['4xl'],
    fontFamily: FontFamily.outfit.bold,
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontSize: FontSize['3xl'],
    lineHeight: LineHeight['3xl'],
    fontFamily: FontFamily.outfit.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  h3: {
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    fontFamily: FontFamily.outfit.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  h4: {
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  h5: {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  h6: {
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },

  // Body text styles
  body: {
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontFamily: FontFamily.outfit.regular,
    fontWeight: FontWeight.normal,
  },
  bodyMedium: {
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  bodyLarge: {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontFamily: FontFamily.outfit.regular,
    fontWeight: FontWeight.normal,
  },
  bodySmall: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontFamily: FontFamily.outfit.regular,
    fontWeight: FontWeight.normal,
  },

  // Chat-specific styles
  chatMessage: {
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontFamily: FontFamily.outfit.regular,
    fontWeight: FontWeight.normal,
  },
  chatUsername: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  chatTimestamp: {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontFamily: FontFamily.outfit.regular,
    fontWeight: FontWeight.normal,
  },

  // UI element styles
  button: {
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  buttonLarge: {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  buttonSmall: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  
  // Input and form styles
  input: {
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontFamily: FontFamily.outfit.regular,
    fontWeight: FontWeight.normal,
  },
  label: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },

  // Caption and meta text
  caption: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontFamily: FontFamily.outfit.regular,
    fontWeight: FontWeight.normal,
  },
  captionMedium: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
  },
  overline: {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontFamily: FontFamily.outfit.medium,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },

  // Monospace for code/technical content
  code: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontFamily: FontFamily.jetbrainsMono.regular,
    fontWeight: FontWeight.normal,
  },
  codeBlock: {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.base,
    fontFamily: FontFamily.jetbrainsMono.regular,
    fontWeight: FontWeight.normal,
  },
};