import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Typography } from '@/constants/Typography';

export type TextVariant = 
  | 'display'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body' | 'bodyMedium' | 'bodyLarge' | 'bodySmall'
  | 'chatMessage' | 'chatUsername' | 'chatTimestamp'
  | 'button' | 'buttonLarge' | 'buttonSmall'
  | 'input' | 'label'
  | 'caption' | 'captionMedium' | 'overline'
  | 'code' | 'codeBlock';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

export function Text({
  variant = 'body',
  color,
  lightColor,
  darkColor,
  style,
  children,
  ...rest
}: TextProps) {
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text'
  );

  const finalColor = color || themeColor;
  const variantStyle = Typography[variant];

  return (
    <RNText
      style={[
        styles.base,
        variantStyle,
        { color: finalColor },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    // Base text styles that apply to all variants
  },
});