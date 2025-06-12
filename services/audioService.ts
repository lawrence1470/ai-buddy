import { Audio } from "expo-av";
import { Alert } from "react-native";

export interface AudioRecording {
  uri: string;
  duration: number;
}

export class AudioService {
  private static recording: Audio.Recording | null = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Permission to access microphone is required!"
        );
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      return true;
    } catch (error) {
      console.error("Permission request failed:", error);
      return false;
    }
  }

  static async startRecording(): Promise<Audio.Recording | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      return recording;
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording");
      return null;
    }
  }

  static async stopRecording(): Promise<AudioRecording | null> {
    if (!this.recording) return null;

    try {
      console.log("Stopping recording...");
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();

      if (!uri) {
        Alert.alert("Error", "No audio file was created");
        return null;
      }

      // Get recording status to calculate duration
      const status = await this.recording.getStatusAsync();
      const duration = status.durationMillis || 0;

      this.recording = null;

      return {
        uri,
        duration: Math.floor(duration / 1000), // Convert to seconds
      };
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Failed to stop recording");
      return null;
    }
  }

  static async transcribeAudio(audioUri: string): Promise<string> {
    try {
      const formData = new FormData();

      formData.append("file", {
        uri: audioUri,
        type: "audio/m4a",
        name: "audio.m4a",
      } as any);

      formData.append("model", "whisper-1");
      formData.append("language", "en");

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.text.trim();
    } catch (error) {
      console.error("Transcription error:", error);
      throw new Error("Failed to transcribe audio");
    }
  }

  static formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}
