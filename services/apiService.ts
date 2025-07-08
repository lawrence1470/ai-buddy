import { API_CONFIG } from "@/constants/api";
import { components } from "@/src/types/api";
import axios, { AxiosError, AxiosResponse } from "axios";

// API Types
type ChatRequest = components["schemas"]["ChatRequest"];
type ChatResponse = components["schemas"]["ChatResponse"];
type HealthStatus = components["schemas"]["HealthStatus"];
type PersonalityProfile = components["schemas"]["PersonalityProfile"];
type SessionRequest = components["schemas"]["SessionRequest"];
type SessionProcessResult = components["schemas"]["SessionProcessResult"];
type SessionSummary = components["schemas"]["SessionSummary"];
type SessionDetails = components["schemas"]["SessionDetails"];

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // This can be extended to include Clerk tokens or other auth mechanisms
    const token = null; // TODO: Get token from auth context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - token may be expired");
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      console.error("Rate limit exceeded");
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

// API Service class
export class ApiService {
  // Chat API
  static async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log("🚀 Sending chat message to:", `${API_CONFIG.BASE_URL}/chat`);
      console.log("📤 Request payload:", JSON.stringify(request, null, 2));

      const response = await apiClient.post<ChatResponse>("/chat", request);

      console.log("✅ Chat response received:", response.status);
      console.log("📥 Response data:", JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      console.error("❌ Chat API Error Details:");

      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Status Text:", error.response?.statusText);
        console.error("Response Data:", error.response?.data);
        console.error("Request URL:", error.config?.url);
        console.error("Request Method:", error.config?.method);
        console.error("Request Data:", error.config?.data);

        // More specific error handling
        const status = error.response?.status;
        if (status === 500) {
          throw new Error(
            "Server error - the backend is having issues processing your request"
          );
        } else if (status === 404) {
          throw new Error(
            "Chat endpoint not found - check if the backend is running"
          );
        } else if (status === 400) {
          throw new Error(
            error.response?.data?.error || "Invalid request format"
          );
        }

        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Failed to send chat message"
        );
      }

      console.error("Non-Axios error:", error);
      throw error;
    }
  }

  // Health check
  static async getHealthStatus(): Promise<HealthStatus> {
    try {
      const response = await apiClient.get<HealthStatus>("/health");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Failed to get health status"
        );
      }
      throw error;
    }
  }

  // Personality API
  static async getPersonalityProfile(
    userId: string
  ): Promise<PersonalityProfile> {
    try {
      const response = await apiClient.get<PersonalityProfile>(
        `/personality/${userId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Personality profile not found");
        }
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Failed to get personality profile"
        );
      }
      throw error;
    }
  }

  // Sessions API
  static async processSession(
    request: SessionRequest
  ): Promise<SessionProcessResult> {
    try {
      const response = await apiClient.post<SessionProcessResult>(
        "/sessions/process",
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Failed to process session"
        );
      }
      throw error;
    }
  }

  static async getUserSessions(
    userId: string,
    limit?: number
  ): Promise<SessionSummary[]> {
    try {
      const response = await apiClient.get<SessionSummary[]>(
        `/sessions/user/${userId}`,
        {
          params: { limit },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Failed to get user sessions"
        );
      }
      throw error;
    }
  }

  static async getSessionDetails(sessionId: string): Promise<SessionDetails> {
    try {
      const response = await apiClient.get<SessionDetails>(
        `/sessions/${sessionId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Session not found");
        }
        throw new Error(
          error.response?.data?.error ||
            error.message ||
            "Failed to get session details"
        );
      }
      throw error;
    }
  }
}

// Export the configured axios instance for direct use if needed
export { apiClient };
