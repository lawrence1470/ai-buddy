import { authService } from "@/services/supabaseService";
import { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await authService.getCurrentSession();
        if (error) {
          setAuthState((prev) => ({
            ...prev,
            error: "Failed to get session",
            loading: false,
          }));
        } else {
          setAuthState((prev) => ({
            ...prev,
            session,
            user: session?.user || null,
            loading: false,
          }));
        }
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: "Authentication error",
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setAuthState((prev) => ({
        ...prev,
        session,
        user: session?.user || null,
        loading: false,
        error: null,
      }));
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await authService.signUp(
        email,
        password,
        userData
      );
      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: "Sign up failed",
          loading: false,
        }));
        return { success: false, error: "Sign up failed" };
      }

      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true, data };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Sign up failed",
        loading: false,
      }));
      return { success: false, error: "Sign up failed" };
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await authService.signIn(email, password);
      if (error || !data) {
        setAuthState((prev) => ({
          ...prev,
          error: "Sign in failed",
          loading: false,
        }));
        return { success: false, error: "Sign in failed" };
      }

      setAuthState((prev) => ({
        ...prev,
        session: data.session,
        user: data.user,
        loading: false,
      }));
      return { success: true, data };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Sign in failed",
        loading: false,
      }));
      return { success: false, error: "Sign in failed" };
    }
  };

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await authService.signOut();
      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: "Sign out failed",
          loading: false,
        }));
        return { success: false, error: "Sign out failed" };
      }

      setAuthState((prev) => ({
        ...prev,
        user: null,
        session: null,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Sign out failed",
        loading: false,
      }));
      return { success: false, error: "Sign out failed" };
    }
  };

  const signInWithOTP = async (email: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await authService.signInWithOTP(email);
      if (error) {
        setAuthState((prev) => ({
          ...prev,
          error: "Failed to send OTP",
          loading: false,
        }));
        return { success: false, error: "Failed to send OTP" };
      }

      setAuthState((prev) => ({ ...prev, loading: false }));
      return { success: true, data };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to send OTP",
        loading: false,
      }));
      return { success: false, error: "Failed to send OTP" };
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await authService.verifyOTP(email, token);
      if (error || !data) {
        setAuthState((prev) => ({
          ...prev,
          error: "Invalid OTP code",
          loading: false,
        }));
        return { success: false, error: "Invalid OTP code" };
      }

      setAuthState((prev) => ({
        ...prev,
        session: data.session,
        user: data.user,
        loading: false,
      }));
      return { success: true, data };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Invalid OTP code",
        loading: false,
      }));
      return { success: false, error: "Invalid OTP code" };
    }
  };

  return {
    // State
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,

    // Actions
    signUp,
    signIn,
    signOut,
    signInWithOTP,
    verifyOTP,
  };
}
