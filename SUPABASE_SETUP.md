# Supabase Setup Guide for AI Buddy

## Overview

This guide will help you set up Supabase in your AI Buddy project for authentication, database operations, and storage.

## 1. Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A new Supabase project created in your dashboard

## 2. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **API Key (anon public)** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Environment Variables Setup

Create a `.env` file in your project root (or add to existing one):

```env
# OpenAI API Key (existing)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

## 4. Usage Examples

### Authentication

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signIn, signUp, signOut, user, loading, error, isAuthenticated } =
    useAuth();

  const handleSignIn = async () => {
    const result = await signIn("user@example.com", "password123");
    if (result.success) {
      console.log("Signed in successfully!");
    } else {
      console.log("Sign in failed:", result.error);
    }
  };

  const handleSignUp = async () => {
    const result = await signUp("user@example.com", "password123", {
      display_name: "John Doe",
    });
    if (result.success) {
      console.log("Signed up successfully!");
    }
  };

  return (
    // Your UI components here
    <View>
      {isAuthenticated ? (
        <Text>Welcome, {user?.email}!</Text>
      ) : (
        <Text>Please sign in</Text>
      )}
    </View>
  );
}
```

### Database Operations

```typescript
import { dbService } from "@/services/supabaseService";

// Create a chat message
const saveMessage = async (message: string, userId: string) => {
  const { data, error } = await dbService.insert("messages", {
    content: message,
    user_id: userId,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving message:", error);
  } else {
    console.log("Message saved:", data);
  }
};

// Get user's messages
const getUserMessages = async (userId: string) => {
  const { data, error } = await dbService.select("messages", {
    where: { user_id: userId },
    order: { column: "created_at", ascending: false },
    limit: 50,
  });

  return data;
};
```

### File Storage

```typescript
import { storageService } from "@/services/supabaseService";

// Upload audio file
const uploadAudio = async (audioUri: string, fileName: string) => {
  const { data, error } = await storageService.uploadFile(
    "audio-files",
    `${fileName}.m4a`,
    {
      uri: audioUri,
      type: "audio/m4a",
      name: `${fileName}.m4a`,
    }
  );

  if (error) {
    console.error("Upload failed:", error);
  } else {
    console.log("File uploaded:", data);
  }
};
```

## 5. Database Schema Examples

Here are some suggested database tables for your AI Buddy app:

### Users Table (handled by Supabase Auth)

```sql
-- This is automatically created by Supabase Auth
-- You can add custom fields to auth.users via the dashboard
```

### Messages Table

```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_ai_response BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Chat Sessions Table

```sql
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);
```

## 6. Storage Buckets

Create these storage buckets in your Supabase dashboard:

1. **audio-files** - For voice recordings
2. **user-uploads** - For any user-uploaded files

## 7. Integration with AI Buddy Features

### Voice Chat Integration

```typescript
// In your chat service, save conversations to Supabase
import { dbService } from "@/services/supabaseService";
import { useAuth } from "@/hooks/useAuth";

export const saveChatMessage = async (
  content: string,
  isAiResponse: boolean = false
) => {
  const { user } = useAuth();
  if (!user) return;

  await dbService.insert("messages", {
    user_id: user.id,
    content,
    is_ai_response: isAiResponse,
  });
};
```

### User Preferences

```typescript
// Store user preferences in their profile
const updateUserPreferences = async (preferences: any) => {
  const { user } = useAuth();
  if (!user) return;

  await dbService.update("profiles", preferences, { user_id: user.id });
};
```

## 8. Security Best Practices

1. **Row Level Security (RLS)**: Always enable RLS on your tables
2. **Environment Variables**: Never commit your `.env` file to version control
3. **API Keys**: Use the `anon` key for client-side operations
4. **Authentication**: Always verify user authentication before sensitive operations

## 9. Testing

To test your Supabase integration:

1. Try signing up a new user
2. Verify the user appears in your Supabase Auth dashboard
3. Test database operations with the authenticated user
4. Check that RLS policies are working correctly

## 10. Troubleshooting

### Common Issues:

1. **"Missing Supabase configuration" error**

   - Check your `.env` file has the correct values
   - Restart your Expo development server after adding environment variables

2. **Authentication not working**

   - Verify your Supabase project URL and anon key
   - Check that email confirmation is disabled in Auth settings (for development)

3. **Database operations failing**
   - Ensure RLS policies are set up correctly
   - Check that the user is authenticated before database operations

## 11. Next Steps

Now that Supabase is set up, you can:

1. Add user authentication to your AI Buddy app
2. Save chat conversations to the database
3. Store user preferences and settings
4. Upload and manage voice recordings
5. Implement real-time features with Supabase subscriptions

For more detailed information, refer to the [Supabase documentation](https://supabase.com/docs).
