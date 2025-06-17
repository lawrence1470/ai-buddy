import { SessionService, SessionWithUI } from "@/services/sessionService";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export function useSessions() {
  const { user } = useUser();
  const [sessions, setSessions] = useState<SessionWithUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userSessions = await SessionService.getUserSessions(user.id);
      const enhancedSessions =
        SessionService.enhanceSessionsForUI(userSessions);

      setSessions(enhancedSessions);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch sessions");
      setSessions([]); // Clear sessions on error
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const success = await SessionService.deleteSession(sessionId);

      if (success) {
        // Remove from local state
        setSessions((prev) =>
          prev.filter((session) => session.id !== sessionId)
        );
        return true;
      } else {
        throw new Error("Failed to delete session");
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      setError(err instanceof Error ? err.message : "Failed to delete session");
      return false;
    }
  };

  const refreshSessions = () => {
    fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, [user?.id]);

  return {
    sessions,
    isLoading,
    error,
    deleteSession,
    refreshSessions,
  };
}
