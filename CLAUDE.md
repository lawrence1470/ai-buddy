# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Buddy is a React Native voice chat application built with Expo that enables conversations with personalized AI companions. Users can select different AI personalities, each with unique voices, traits, and conversation styles. The app supports both voice and text interactions with real-time speech synthesis.

## Development Commands

### Essential Commands

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality checks

### Type Generation

- `npm run generate-types` - Generate API types from backend OpenAPI spec at https://ai-buddy-backend.onrender.com/swagger.json

### Development Workflow

- Always run `npm run lint` after making code changes
- Use `npm run generate-types` when backend API changes
- Backend must be running on https://ai-buddy-backend.onrender.com for full functionality

## Architecture Overview

### Core Stack

- **Frontend**: React Native with Expo (~53.0.11)
- **Navigation**: Expo Router with file-based routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **Authentication**: Clerk for user authentication and profile management
- **Backend Integration**: Custom REST API at https://ai-buddy-backend.onrender.com
- **Styling**: StyleSheet with glassmorphism design theme

### App Structure

```
app/
├── (tabs)/                 # Tab-based navigation
│   ├── index.tsx          # Home screen with chat interface
│   ├── personality.tsx    # AI buddy selection screen
│   └── settings.tsx       # User settings
├── _layout.tsx            # Root layout with providers
├── ai-buddy-selection.tsx # AI buddy selection modal
├── new-chat.tsx          # New chat screen
└── profile-setup.tsx     # User profile setup
```

### Key Components

- **Chat.tsx**: Main chat interface with voice/text input, message rendering, and TTS integration
- **AIBuddyCard.tsx**: Display cards for AI personalities with voice preview
- **VoiceRecorder.tsx**: Voice recording interface with visual feedback
- **Orb.tsx**: Animated orb component representing AI personality

### Services Architecture

- **apiService.ts**: Axios-powered HTTP client for backend communication
- **aiBuddyService.ts**: AI personality management and selection
- **chatService.ts**: Chat message handling and AI response processing
- **ttsService.ts**: Text-to-speech using OpenAI TTS API
- **audioService.ts**: Audio recording and transcription via OpenAI Whisper

### Backend Integration

The app integrates with a custom backend API running on https://ai-buddy-backend.onrender.com:

- **Chat API**: `/chat` endpoint for AI conversations with buddy-specific responses
- **AI Buddies**: `/ai-buddies` for fetching available personalities
- **User Selection**: `/users/{userId}/selected-buddy` for user's chosen AI companion
- **Sessions**: Session management for conversation history

### Data Flow

1. User selects AI buddy via `AIBuddyService.setUserSelectedBuddy()`
2. Voice recording captured through `useVoiceRecording` hook
3. Audio transcribed via OpenAI Whisper in `audioService.ts`
4. Chat messages sent to backend with buddy_id parameter
5. AI responses generated using selected buddy's personality
6. Text-to-speech synthesis using buddy's voice characteristics

### Authentication & User Management

- Clerk handles user authentication, session management, and user profiles
- Backend API receives user context for personalized responses

### Voice & Audio Features

- Real-time audio recording with visual feedback
- OpenAI Whisper for speech-to-text transcription
- OpenAI TTS for AI voice responses with per-buddy voice characteristics
- ElevenLabs integration planned for custom voices (backend-configured)

### Environment Configuration

Required environment variables:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `EXPO_PUBLIC_API_BASE_URL` - Backend API URL (defaults to https://ai-buddy-backend.onrender.com)
- `EXPO_PUBLIC_OPENAI_API_KEY` - OpenAI API access (if needed for direct client calls)

### Key Development Patterns

- Use TypeScript generated types from `src/types/api.ts`
- Components follow themed design system with dark/light mode support
- Error handling includes graceful fallbacks for offline/API failures
- Real-time state updates using TanStack Query mutations
- Accessibility support with proper labeling and haptic feedback

### Testing & Quality

- ESLint configuration with Expo-specific rules
- TypeScript strict mode enabled
- Error boundaries for graceful error handling
- Comprehensive logging for debugging backend integration
