import { Audio } from "expo-av";

export class TTSService {
  private static sound: Audio.Sound | null = null;

  static async speakText(text: string): Promise<void> {
    try {
      // Clean up previous sound
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Generate speech using OpenAI TTS
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: "alloy", // You can change this to: alloy, echo, fable, onyx, nova, shimmer
          response_format: "mp3",
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      // Get the audio data as blob
      const audioBlob = await response.blob();

      // Convert blob to base64 for React Native
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result as string;

            // Set audio mode for playback
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: false,
              staysActiveInBackground: false,
              playsInSilentModeIOS: true,
              shouldDuckAndroid: true,
              playThroughEarpieceAndroid: false,
            });

            // Load and play the audio
            const { sound } = await Audio.Sound.createAsync(
              { uri: base64Audio },
              { shouldPlay: true }
            );

            this.sound = sound;

            // Set up completion callback
            sound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
                this.sound = null;
              }
            });

            resolve();
          } catch (error) {
            console.error("Error playing TTS audio:", error);
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to convert audio blob"));
        };
      });
    } catch (error) {
      console.error("TTS error:", error);
      // Don't show alert for TTS errors, just log them
      throw error;
    }
  }

  static async stopSpeaking(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error("Error stopping TTS:", error);
    }
  }

  static async isSpeaking(): Promise<boolean> {
    try {
      if (!this.sound) return false;

      const status = await this.sound.getStatusAsync();
      return status.isLoaded && status.isPlaying;
    } catch (error) {
      return false;
    }
  }
}
