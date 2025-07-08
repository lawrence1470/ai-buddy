import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function BlurTabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}>
      <BlurView
        // Use a lighter blur for a cleaner look
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        intensity={80}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
