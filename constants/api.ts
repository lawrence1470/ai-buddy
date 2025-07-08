// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API
  BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "https://ai-buddy-backend.onrender.com",

  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,

  // Default headers for API requests
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: "/health",
  USER_SESSIONS: (userId: string) => `/sessions/user/${userId}`,
  DELETE_SESSION: (sessionId: string) => `/sessions/${sessionId}`,
  PROCESS_SESSION: "/sessions/process",
  USER_PERSONALITY: (userId: string) => `/personality/${userId}`,
} as const;

// Helper function to build full URL
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to create fetch options with default headers
export function createFetchOptions(options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...options.headers,
    },
  };
}
