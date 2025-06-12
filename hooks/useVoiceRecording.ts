import { AudioService } from "@/services/audioService";
import { Audio } from "expo-av";
import { useCallback, useRef, useState } from "react";

export interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isVoiceLoading: boolean;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
}

export function useVoiceRecording(): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const recording = useRef<Audio.Recording | null>(null);
  const recordingInterval = useRef<number | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const newRecording = await AudioService.startRecording();
      if (!newRecording) return;

      recording.current = newRecording;
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!recording.current) return null;

    setIsRecording(false);
    setIsVoiceLoading(true);

    try {
      // Clear the interval
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }

      const audioRecording = await AudioService.stopRecording();
      if (!audioRecording) {
        setIsVoiceLoading(false);
        return null;
      }

      // Transcribe the audio
      try {
        const transcribedText = await AudioService.transcribeAudio(
          audioRecording.uri
        );
        setIsVoiceLoading(false);
        setRecordingDuration(0);
        recording.current = null;

        return (
          transcribedText ||
          `Voice message recorded (${AudioService.formatDuration(
            audioRecording.duration
          )})`
        );
      } catch (transcriptionError) {
        console.error(
          "Transcription failed, using fallback:",
          transcriptionError
        );
        setIsVoiceLoading(false);
        setRecordingDuration(0);
        recording.current = null;

        return `Voice message recorded (${AudioService.formatDuration(
          audioRecording.duration
        )})`;
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setIsVoiceLoading(false);
      setRecordingDuration(0);
      recording.current = null;
      return null;
    }
  }, []);

  return {
    isRecording,
    isVoiceLoading,
    recordingDuration,
    startRecording,
    stopRecording,
  };
}
