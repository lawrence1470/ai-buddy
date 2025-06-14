import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Supabase configuration
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Please check your environment variables."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable auto refresh of the session
    autoRefreshToken: true,
    // Persist the session across app restarts
    persistSession: true,
    // Storage adapter for Expo (uses AsyncStorage by default)
    storage: undefined, // Let Supabase use its default storage
  },
});

// Auth helper functions
export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, userData?: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      return { data, error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      console.error("Get current user error:", error);
      return { user: null, error };
    }
  },

  // Get current session
  async getCurrentSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      console.error("Get current session error:", error);
      return { session: null, error };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Sign in with OTP (email magic link)
  async signInWithOTP(email: string) {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // You can customize the email template and redirect URL here
          emailRedirectTo: undefined, // Will use default
        },
      });
      return { data, error };
    } catch (error) {
      console.error("Sign in with OTP error:", error);
      return { data: null, error };
    }
  },

  // Verify OTP code
  async verifyOTP(email: string, token: string) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      return { data, error };
    } catch (error) {
      console.error("Verify OTP error:", error);
      return { data: null, error };
    }
  },
};

// Database helper functions
export const dbService = {
  // Generic select function
  async select(table: string, query?: any) {
    try {
      let dbQuery = supabase.from(table).select(query?.select || "*");

      if (query?.where) {
        Object.entries(query.where).forEach(([key, value]) => {
          dbQuery = dbQuery.eq(key, value);
        });
      }

      if (query?.order) {
        dbQuery = dbQuery.order(query.order.column, {
          ascending: query.order.ascending,
        });
      }

      if (query?.limit) {
        dbQuery = dbQuery.limit(query.limit);
      }

      const { data, error } = await dbQuery;
      return { data, error };
    } catch (error) {
      console.error("Database select error:", error);
      return { data: null, error };
    }
  },

  // Generic insert function
  async insert(table: string, data: any) {
    try {
      const { data: insertedData, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      return { data: insertedData, error };
    } catch (error) {
      console.error("Database insert error:", error);
      return { data: null, error };
    }
  },

  // Generic update function
  async update(table: string, data: any, where: any) {
    try {
      let updateQuery = supabase.from(table).update(data);

      Object.entries(where).forEach(([key, value]) => {
        updateQuery = updateQuery.eq(key, value);
      });

      const { data: updatedData, error } = await updateQuery.select();
      return { data: updatedData, error };
    } catch (error) {
      console.error("Database update error:", error);
      return { data: null, error };
    }
  },

  // Generic delete function
  async delete(table: string, where: any) {
    try {
      let deleteQuery = supabase.from(table).delete();

      Object.entries(where).forEach(([key, value]) => {
        deleteQuery = deleteQuery.eq(key, value);
      });

      const { error } = await deleteQuery;
      return { error };
    } catch (error) {
      console.error("Database delete error:", error);
      return { error };
    }
  },
};

// Storage helper functions
export const storageService = {
  // Upload file
  async uploadFile(bucket: string, path: string, file: any) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      return { data, error };
    } catch (error) {
      console.error("Storage upload error:", error);
      return { data: null, error };
    }
  },

  // Download file
  async downloadFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);
      return { data, error };
    } catch (error) {
      console.error("Storage download error:", error);
      return { data: null, error };
    }
  },

  // Get public URL
  getPublicUrl(bucket: string, path: string) {
    try {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    } catch (error) {
      console.error("Storage get public URL error:", error);
      return null;
    }
  },

  // Delete file
  async deleteFile(bucket: string, paths: string[]) {
    try {
      const { data, error } = await supabase.storage.from(bucket).remove(paths);
      return { data, error };
    } catch (error) {
      console.error("Storage delete error:", error);
      return { data: null, error };
    }
  },
};

export default supabase;
