// Force light mode throughout the app
export function useColorScheme() {
  return 'light' as const;
}

// Original implementation (for future use when dark mode is needed):
// export { useColorScheme } from 'react-native';
