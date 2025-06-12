# AI Buddy - Voice Chat App

A modern React Native app built with Expo that allows voice conversations with an AI assistant. The AI can both understand your speech and respond with its own voice.

## 🎯 Features

- **Voice Recording**: High-quality audio recording with visual feedback
- **Speech-to-Text**: Automatic transcription using OpenAI Whisper
- **AI Conversations**: Intelligent responses powered by GPT-3.5 Turbo
- **Text-to-Speech**: AI responses are spoken aloud with natural voice
- **Modern UI**: Beautiful, animated interface with dark mode support
- **Modular Architecture**: Clean, maintainable code structure

## 🏗️ Architecture

The app follows a modular architecture with clear separation of concerns:

### Services (`/services`)

- **`audioService.ts`** - Handles audio recording, permissions, and transcription
- **`chatService.ts`** - Manages AI conversations and message history
- **`ttsService.ts`** - Converts AI responses to speech

### Components (`/components`)

- **`Chat.tsx`** - Main chat interface and message rendering
- **`VoiceRecorder.tsx`** - Voice recording UI with animations
- **`ThemedText.tsx`** - Themed text component

### Hooks (`/hooks`)

- **`useVoiceRecording.ts`** - Custom hook for voice recording logic
- **`useColorScheme.ts`** - Theme management hook

## 🚀 Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up OpenAI API**

   Create a `.env.local` file with your OpenAI API key:

   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the app**
   ```bash
   npx expo start
   ```

## 🎤 How it Works

1. **Voice Input**: User taps the microphone button to start recording
2. **Transcription**: Audio is sent to OpenAI Whisper for transcription
3. **AI Processing**: Transcribed text is sent to GPT-3.5 Turbo for response
4. **Voice Output**: AI response is converted to speech using OpenAI TTS
5. **Playback**: The AI's voice response is played automatically

## 🛠️ Key Technologies

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and build tools
- **TypeScript** - Type-safe JavaScript
- **OpenAI Whisper** - Speech-to-text transcription
- **OpenAI GPT-3.5 Turbo** - Conversational AI
- **OpenAI TTS** - Text-to-speech synthesis
- **React Native Reanimated** - Smooth animations

## 📱 Platform Support

- **iOS** - Full support with native audio APIs
- **Android** - Full support with native audio APIs
- **Web** - Limited support (recording may vary by browser)

## 🎨 Design Features

- **Animated Voice Button**: Pulsing and ripple effects during recording
- **Message Bubbles**: Distinct styling for user and AI messages
- **Voice Indicators**: Visual markers for voice messages
- **Loading States**: Smooth loading animations during processing
- **Dark Mode**: Automatic theme switching based on system preferences

## 🔧 Customization

### Changing AI Voice

Edit `services/ttsService.ts` to change the AI voice:

```typescript
voice: "alloy"; // Options: alloy, echo, fable, onyx, nova, shimmer
```

### Adjusting AI Behavior

Modify the system message in `services/chatService.ts`:

```typescript
const systemMessage = {
  role: "system",
  content: "Your custom AI personality and instructions here...",
};
```

### UI Theming

Colors and styles can be customized in each component's StyleSheet.

## 📝 Environment Variables

- `EXPO_PUBLIC_OPENAI_API_KEY` - Your OpenAI API key (required)

## 🚦 Error Handling

The app includes robust error handling:

- **Permission Errors**: Graceful microphone permission requests
- **Network Errors**: Fallback responses when APIs are unavailable
- **Transcription Errors**: Fallback to duration display if transcription fails
- **TTS Errors**: Silent fallback if voice synthesis fails

## 📦 Dependencies

Key dependencies include:

- `expo-av` - Audio recording and playback
- `@expo/vector-icons` - Icon components
- `react-native-reanimated` - Animations
- `react-native-safe-area-context` - Safe area handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the existing architecture
4. Test on both iOS and Android
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Expo and OpenAI APIs
